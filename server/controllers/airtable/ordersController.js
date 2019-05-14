import Airtable from 'airtable'
import dataController from "./dataController"
import moment from 'moment'

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);


const dealWithNaN = (fieldToDealWith) => {
    if (fieldToDealWith.specialValue) { //we have NaN
        return 0;
    } else {
        return fieldToDealWith;
    }

};

const dealWithLocationBlanks = (fieldToDealWith) => {
    console.log("zPlanting field to deal with: " + JSON.stringify(fieldToDealWith))
    if (!fieldToDealWith) {
        return "undefined"
    } else {
        return (fieldToDealWith["text"])
    }
}

const getHarvestRequestById = (id) => {
    return new Promise((resolve, reject) => {
        const processRecord = (err, record) => {
            if (err) {
                reject(err);
                return;
            }

            const id = {id: record.id};
            const fields = record.fields;
            record = {...id, ...fields};
            resolve(record);
        };

        base('Harvest Requests').find(id, processRecord);
    });

};

const getHarvestRequestId = (id) => {
    console.log("get harvest request by ID:" + id);
    return new Promise((resolve, reject) => {
        const processRecord = (err, record) => {
            if (err) {
                reject(err);
                return;
            }

            const id = {id: record.id};
            const fields = record.fields;
            record = {...id, ...fields};
            resolve(record);
        };

        base('Harvest Requests').find(id, processRecord);
    });

};

const createHarvestRequest = (customer, crop, amount, date, orderId) => {

    return new Promise((resolve, reject) => {

        const newRecord = {
            "Customer": customer,
            "Crop": crop,
            "Amount (g)": amount,
            "Date": date,
            "Order ID" : [orderId]
        };

        const processRecord = (err, record) => {
            if (err) {
                reject(err);
                return;
            }

            const id = {id: record.id};
            const fields = record.fields;
            record = {...id, ...fields};
            resolve(record);
        };

        base('Harvest Requests').create(newRecord, processRecord);
    });

}


const createPlantingOrder = (crop, amount, date, excess, requests) => {

    return new Promise((resolve, reject) => {

        const newRecord = {
            "Crop": crop,
            "# of Flats": amount,
            "Date": date,
            "Excess": excess,
            "Planting Requests": requests
        };

        const processRecord = (err, record) => {
            if (err) {
                reject(err);
                return;
            }

            const id = {id: record.id};
            const fields = record.fields;
            record = {...id, ...fields};
            console.log("New Planting order returned: " + JSON.stringify(record))
            resolve(record);
        };
        console.log("In create planting order excess: " + excess)
        console.log("In create planting order requests: " + requests)
        console.log("New planting order record: " + JSON.stringify(newRecord));
        base('Planting Orders').create(newRecord, processRecord);
    });

}

const createPlantingRequest = (harvestId, crop, amount, date) => {

    return new Promise((resolve, reject) => {

        const newRecord = {
            "Harvest Request": [harvestId],
            "Crop": crop,
            "Amount (g)": amount,
            "Date": date
        };

        const processRecord = (err, record) => {
            if (err) {
                console.log("Planting request error: " + err)
                reject(err);
                return;
            }

            const id = {id: record.id};
            const fields = record.fields;
            record = {...id, ...fields};
            resolve(record);
        };

        base('Planting Requests').create(newRecord, processRecord);
    });
}

/**
 * Replace supplier ids in product with
 * actual supplier information
 * @param {*} order
 */
const hydrateOrders = async (order) => {
    if (order["Harvest Requests"]) {
        let harvestRequests = order["Harvest Requests"];
        let harvestRequestDetails = [];
        // console.log("In hydrate orders: " + JSON.stringify(order));
        for (const id of harvestRequests) {
            // console.log("looping trhough requests: " + JSON.stringify(id));
            harvestRequestDetails.push(await getHarvestRequestId(id))
        }
        // console.log("Processed: " + JSON.stringify(harvestRequestDetails));

        order["Harvest Requests"] = harvestRequestDetails;
    }
    return order;
};

const getCropInformation = async () => {
    const TABLE = base('Crop Recipes');
    const OPTIONS = {}
    const crops = await dataController.getAirtableRecords(TABLE, OPTIONS);
    console.log("Crops from get: " + JSON.stringify(crops));

    return crops.map(crop => {
        console.log("Order: " + JSON.stringify(crop));

        return {
            id: crop.getId(),
            commonName: crop.get('Common Name'),
            days: Math.ceil(crop.get('Ave. G. Tot Days')),
            averageHarvestWeight: crop.get('Avg. Good H wt')
        }
    });
};

const deleteRecords = async () => {

    await dataController.deleteAllRecords(base('Planting Requests'));
    await dataController.deleteAllRecords(base('Harvest Requests'));
    await dataController.deleteAllRecords(base('Planting Orders'));


};

const calculateNumberOfFlats = (harvestWeight, cropId, crops) => {
    let foundCrop = crops.find((crop) => {
        return crop.id === cropId
    });
    console.log("Total days for crop: " + foundCrop.commonName + " - " + foundCrop.days);
    let numberOfFlats = Math.ceil(harvestWeight / foundCrop.averageHarvestWeight);
    let excess = (numberOfFlats * foundCrop.averageHarvestWeight) - harvestWeight;
    console.log("Excess: " + excess)
    return {
        numberOfFlats: numberOfFlats,
        excess: excess
    };

};

const calculateNextDeliveryDay = (deliveryDay) => {
    let dayInNeed = 0;
    if (deliveryDay === "Tuesday") {
        dayInNeed = 2; // for Tuesday
    } else {
        dayInNeed = 5; // for Friday
    }


// if we haven't yet passed the day of the week that I need:
    if (moment().isoWeekday() <= dayInNeed) {
        // then just give me this week's instance of that day
        return moment().isoWeekday(dayInNeed);
    } else {
        // otherwise, give me next week's instance of that day
        return moment().add(1, 'weeks').isoWeekday(dayInNeed);
    }
};

const calculatePreviousMondayOrThursday = (day) => {
    let offset = 0
    switch (day.day()) {
        case 0:
            offset = -3;
            break;
        case 1:
            offset = 0;
            break;
        case 2:
            offset = -1;
            break;
        case 3:
            offset = -2;
            break;
        case 4:
            offset = 0;
            break;
        case 5:
            offset = -1;
            break;
        case 6:
            offset = -2;
    }
    return day.add(offset, 'days')
}

/**
 * Get products with their suppliers
 *
 */
const getOrdersAndHarvestRequests = async (page) => {
    const TABLE = base('Orders');
    const OPTIONS = {}

    const orders = await dataController.getAirtableRecords(TABLE, OPTIONS);
    console.log("Orders from get: " + JSON.stringify(orders));

    return orders.map(order => {
        console.log("Order: " + JSON.stringify(order));
        const id = {id: order.id};
        const fields = order.fields;
        // record = {...id, ...fields};
        return {
            ...id,
            ...fields
        }
    });
};


const getTotalDays = (crops, cropId) => {
    // console.log("get total days crop: " + crops )
    let foundCrop = crops.find((crop) => {
        return crop.id === cropId
    });
    console.log("Total days for crop: " + foundCrop.commonName + " - " + foundCrop.days);
    return foundCrop.days;
};


function createHarvestRecords(ordersToProcess, crops, addPlantingRequestToOrders, cutoffDate) {

    let promises = [];
    ordersToProcess.map((order) => {

        let totalDays = getTotalDays(crops, order.Crop[0]);
        let plantingDate, harvestDate;
        let plantingRequest = [];
        let harvest = [];

        if (order["Order Type"] === "One off") {
            let harvestDate = moment(order["First Delivery"])
            plantingDate = calculatePreviousMondayOrThursday(moment(harvestDate).subtract(totalDays, 'days'));
            promises.push(createHarvestRequest(
                order.Company,
                order.Crop,
                order['Amount (g)'],
                harvestDate.format('MM/DD/YYYY'),
                order.id))
            // console.log("Harvest: " + JSON.stringify(harvest))
            // plantingRequest = await createPlantingRequest(harvest.id, order.Crop, order['Amount (g)'], plantingDate.format('MM/DD/YYYY'))
            // await addPlantingRequestToOrders(plantingRequest);
        } else {

            const nextDeliveryDay = calculateNextDeliveryDay(order["Day Delivered"]);
            const today = moment(new Date());
            console.log("Next Delivery Day: " + nextDeliveryDay);
            // let harvestDate = nextDeliveryDay - getTotalDays(order.Crop[0]);
            // let harvestDate = moment(nextDeliveryDay).subtract(totalDays, 'days');
            harvestDate = moment(nextDeliveryDay);
            while (harvestDate.isSameOrBefore(cutoffDate, 'days')) {
                plantingDate = calculatePreviousMondayOrThursday(moment(harvestDate).subtract(totalDays, 'days'));
                if (plantingDate.isSameOrAfter(today, 'days')) {
                    promises.push(createHarvestRequest(
                        order.Company,
                        order.Crop,
                        order['Amount (g)'],
                        harvestDate.format('MM/DD/YYYY'),
                        order.id))
                    // console.log("Harvest: " + JSON.stringify(harvest))
                    // plantingRequest = await createPlantingRequest(harvest.id, order.Crop, order['Amount (g)'], plantingDate.format('MM/DD/YYYY'))
                    // await addPlantingRequestToOrders(plantingRequest);
                }
                harvestDate.add(7, 'days');
            }
        }

    });
    return promises;
}

const controller = {

    // processOrder: (order) => {
    //     console.log("Processing order: " + JSON.stringify(order));
    //     // const filterFormula = "{Order ID}='" + order.id + "'";
    //     const filterFormula = 'SEARCH("' + order.id + '" ,{Order ID})';
    //     console.log("Filter formula: " + filterFormula);
    //     const OPTIONS = {
    //         // view: 'Grid view',
    //         pageSize: 24,
    //         // filterByFormula: "SEARCH('rechg2kHJ62IEWWEV' ,{Order ID})"
    //     };
    //     const TABLE = base('Harvest Requests');
    //     const harvestRequests =  dataController.getAirtableRecords(TABLE, OPTIONS);
    //     console.log("Harvest Requests: " + JSON.stringify(harvestRequests))
    // },

    getHarvestRequests: async (req, res) => {
        const OPTIONS = {
            // view: 'Grid view',
            pageSize: 24,
            filterByFormula: "SEARCH('rechg2kHJ62IEWWEV' ,{Order ID})"
        };
        const TABLE = base('Harvest Requests');
        const harvestRequests = await dataController.getAirtableRecords(TABLE, OPTIONS);
        console.log("Harvest Requests: " + JSON.stringify(harvestRequests));
        res.json(harvestRequests)

    },

    getHydratedOrders: async (req, res) => {
        let page = req.params.page || req.query.page || 1;
        getOrdersAndHarvestRequests(page)
            .then(async (orders) => {
                console.log("Orders: " + JSON.stringify(orders));
                const hydratedOrders = [];

                for (const order of orders) {
                    console.log("Starting to hydrate order: " + JSON.stringify(order));
                    hydratedOrders.push(await hydrateOrders(order));
                }
                console.log("Hydrated Orders: " + hydratedOrders);
                res.json(hydratedOrders)
            });
    },

    deleteExistingRecords: async (req, res) => {
        deleteRecords();
        res.json("Records deleted");
    },


    addHarvestRequests: async (req, res) => {

        await deleteRecords();

        const crops = await getCropInformation();
        console.log("Crops: " + crops)

        let cutOffDate = new Date(req.body.cutOffDate);
        console.log("Cutoff date: " + cutOffDate);

        const OPTIONS = {
            // view: 'Grid view',
            pageSize: 24
        };

        const TABLE = base('Orders');
        const Orders = await dataController.getAirtableRecords(TABLE, OPTIONS);

        let ordersToProcess = Orders.map(order => {
            const id = {id: order.id};
            const fields = order.fields;

            return {
                ...id,
                ...fields
            };
        });

        const cutoffDate = moment(new Date()).add(8, 'weeks');

        let plantingOrders = []

        const addPlantingRequestToOrders = (plantingRequest) => {
            console.log("incoming planting reqeust: " + JSON.stringify(plantingRequest))
            let dateRequest = plantingOrders.find(plantingOrder => plantingRequest.Date === plantingOrder.plantingDate)
            if (!dateRequest) {
                dateRequest = {plantingDate: plantingRequest.Date, plantings: []}
                plantingOrders.push(dateRequest)
            }
            console.log("Crop id: " + plantingRequest.Crop[0]);
            let cropRequest = dateRequest.plantings.find(planting => plantingRequest.Crop[0] === planting.CropID[0]);
            if (!cropRequest) {
                cropRequest = {
                    CropID: plantingRequest.Crop,
                    amount: plantingRequest["Amount (g)"],
                    requests: [plantingRequest.id]
                }
                dateRequest.plantings.push(cropRequest)
            } else {
                cropRequest.amount += plantingRequest["Amount (g)"]
                cropRequest.requests.push(plantingRequest.id)
            }
            console.log("Planting Orders: " + JSON.stringify(plantingOrders));
        }


        Promise.all(createHarvestRecords(ordersToProcess, crops, addPlantingRequestToOrders, cutoffDate))
            .then((harvestRequests) => {
                console.log("Harvest Requests: " + JSON.stringify(harvestRequests));
                let promises = harvestRequests.map((harvestRequest) => {
                    let totalDays = getTotalDays(crops, harvestRequest.Crop[0]);
                    let plantingDate = calculatePreviousMondayOrThursday(moment(harvestRequest.Date).subtract(totalDays, 'days'));
                    return createPlantingRequest(harvestRequest.id, harvestRequest.Crop, harvestRequest['Amount (g)'], plantingDate.format('MM/DD/YYYY'))
                });
                Promise.all(promises)
                    .then((plantingRequests) => {
                        console.log("Planting Requests: " + JSON.stringify(plantingRequests));
                        console.log("Orders processed: " + JSON.stringify(ordersToProcess[0]));
                        plantingRequests.forEach(plantingRequest => {
                            addPlantingRequestToOrders(plantingRequest)
                        })
                        console.log("Planting Orderszzz: " + JSON.stringify(plantingOrders));
                        let promises = [];
                        plantingOrders.forEach(plantingOrder => {
                            plantingOrder.plantings.forEach(planting => {
                                let flatsCalculations = calculateNumberOfFlats(planting.amount, planting.CropID[0], crops)
                                let excess = flatsCalculations.excess;
                                console.log("Flats calcuations: " + JSON.stringify(flatsCalculations))
                                console.log("Extracted excess: " + excess)
                                promises.push(createPlantingOrder(
                                    planting.CropID,
                                    flatsCalculations.numberOfFlats,
                                    plantingOrder.plantingDate,
                                    flatsCalculations.excess,
                                    planting.requests))
                            })
                        })
                        Promise.all(promises)
                            .then(plantingOrderReturn => {
                                console.log("Planting Orders return: " + JSON.stringify(plantingOrderReturn));
                                res.json(ordersToProcess);
                            })
                    })
            })
    },

};

export {controller as default};
