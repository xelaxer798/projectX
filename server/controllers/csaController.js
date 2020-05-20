import sgMail from '@sendgrid/mail';
import Stripe from 'stripe';
import moment from 'moment'

const stripe = new Stripe(process.env.STRIPE_API_KEY)

const sengrido = process.env.sendgrid
sgMail.setApiKey(sengrido);

function createLocationHTML(location) {
    let locationHTML;
    let hoursHTML;

    switch (location) {
        case "Santa Barbara":
            locationHTML = "<br/>&nbsp;&nbsp;&nbsp;&nbsp;Barbarennño<br/>"
            locationHTML += "&nbsp;&nbsp;&nbsp;&nbsp;205 W. Cañon Perdido St.<br/>"
            locationHTML += "&nbsp;&nbsp;&nbsp;&nbsp;Santa Barbara, CA 93101<br/>"
            locationHTML += "&nbsp;&nbsp;&nbsp;&nbsp;805.963.9591"
            hoursHTML = "<strong>Wednesdays 12-8 pm</strong>"
            break;
        case "Piru":
            locationHTML = "<br/>&nbsp;&nbsp;&nbsp;&nbsp;Plate Linguistics<br/>"
            locationHTML += "&nbsp;&nbsp;&nbsp;&nbsp;1101 Piru Canyon Road<br/>"
            locationHTML += "&nbsp;&nbsp;&nbsp;&nbsp;Piru, CA 93040<br/>"
            locationHTML += "&nbsp;&nbsp;&nbsp;&nbsp;617.666.8486"
            hoursHTML = "<strong>Wednesdays 12-8 pm</strong>"
            break;
        default:
            locationHTML = "unknown"
            hoursHTML = "unknown"
    }

    return {
        location: locationHTML,
        hours: hoursHTML
    }
}

function createdEmaillHTML(subscription, customer, product, dateInformation) {
    let returnHtml = "";
    const locationInfo = createLocationHTML(product.metadata.pickupLocation)
    returnHtml +=  customer.name + ",<br/><br/>"
    returnHtml +=  "Thank you for your purchase of: <strong>" + product.name + "</strong><br/><br/>"
    returnHtml +=  "Your pick up location is: <br/><strong>" + locationInfo.location + "</strong><br/><br/>"
    returnHtml +=  "<font color='#2e8b57'><strong>Your start date is: " + dateInformation.firstPickupDateFormatted + "</strong></font><br/><br/>"
    returnHtml +=  "Your pick up window is: <strong>" + locationInfo.hours + "</strong><br/><br/>"
    returnHtml +=  "You will be billed monthly on: <strong>" + dateInformation.billingDay + "</strong><br/><br/>"
    returnHtml +=  "We look forward to providing you most consistently robust, vibrant, flavor-drenched varieties of microgreens on a weekly basis.<br/><br/>"
    returnHtml +=  "If you have any questions or comments please contact us at info@platelinguistics.com.<br/><br/>"

    return returnHtml;
}


function getTrialEndDate() {
    const SUNDAY = 0;
    const MONDAY = 1;
    const TUESDAY = 2;
    const WEDNESDAY = 3;
    const THURSDAY = 4;
    const FRIDAY = 5;
    const SATURDAY = 6;

    let dateCreated = moment();
    let trialEndDate;

    let dayOfWeekCreated = dateCreated.day();

    switch (dayOfWeekCreated) {
        case SUNDAY:
            trialEndDate = dateCreated.add(3 + 7, 'days');
            break;
        case MONDAY:
            trialEndDate = dateCreated.add(2 + 7, 'days');
            break;
        case TUESDAY:
            trialEndDate = dateCreated.add(1 + 7, 'days');
            break;
        case WEDNESDAY:
            trialEndDate = dateCreated.add(7, 'days');
            break;
        case THURSDAY:
            trialEndDate = dateCreated.add(6 + 7, 'days');
            break;
        case FRIDAY:
            trialEndDate = dateCreated.add(5 + 7, 'days');
            break;
        case SATURDAY:
            trialEndDate = dateCreated.add(4 + 7, 'days');
            break;
        default:
            trialEndDate = dateCreated.add(7, 'days');
            console.log("In default");
            break;
    }
    let trialEndDateUnix = Math.floor(trialEndDate / 1000)


    return {
        trialEndDate: trialEndDate.unix(),
        firstPickupDateFormatted: trialEndDate.format("dddd, MMMM Do YYYY"),
        billingDay:  " the " + trialEndDate.format("Do") + " of the month"
    }

}

const controller = {
    handleSignUp: async function (req, res) {
        console.log("Request: " + JSON.stringify(req.body.data))
        const billingCycleAnchor = req.body.data.object.billing_cycle_anchor;
        const dateInformation = getTrialEndDate()
        console.log("Date information: " + JSON.stringify(dateInformation))
        const subscriptionID = req.body.data.object.items.data[0].subscription;
        const subscription = await stripe.subscriptions.update(subscriptionID, {
            trial_end: dateInformation.trialEndDate,
            proration_behavior: 'none',
        });
        console.log("Subscription: " + JSON.stringify(subscription));
        const customerId = subscription.customer;
        console.log("CustomerId: " + customerId);

        const customer = await stripe.customers.retrieve(
            customerId,
            // await function(err, customer) {
            //     console.log("Customerzzz: " + JSON.stringify(customer))
            //
            //     return customer
            // }

        )

        const productId = subscription.plan.product;
        const product = await stripe.products.retrieve(
            productId
        );
        console.log("Product: " + JSON.stringify(product))

        console.log("Customer: " + JSON.stringify(customer))

        const msg = {
            to: customer.email,
            bcc: "info@platelinguistics.com",

            from: 'Plate Linguistics<info@platelinguistics.com',
            subject: 'Plate Linguistics Monthly Microgreen Subscription',
            text: 'Click me ',
            html: createdEmaillHTML(subscription, customer, product, dateInformation)
        }
        console.log("Mail api key: " + sengrido);

        sgMail.send(msg);

    }
};

export {controller as default};
