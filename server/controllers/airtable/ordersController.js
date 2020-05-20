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
            "Order ID": [orderId]
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

};

const createHarvestRequestsBulk = (harvestRequests) => {

}


const createPlantingOrder = (crop, amount, date, excess, requests, customers) => {

    return new Promise((resolve, reject) => {

        const newRecord = {
            "Crop": crop,
            "# of Flats": amount,
            "Date": date,
            "Excess": excess,
            "Planting Requests": requests,
            "Customers": customers
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

const createHarvestOrder = (crop, amount, date, excess, requests, customers) => {

    return new Promise((resolve, reject) => {

        const newRecord = {
            "Crop": crop,
            "# of Flats": amount,
            "Date": date,
            "Excess": excess,
            "Harvest Requests": requests,
            "Customers": customers
        };

        const processRecord = (err, record) => {
            if (err) {
                reject(err);
                return;
            }

            const id = {id: record.id};
            const fields = record.fields;
            record = {...id, ...fields};
            console.log("New Harvest order returned: " + JSON.stringify(record))
            resolve(record);
        };
        base('Harvest Orders').create(newRecord, processRecord);
    });

}

const createProjectedSlotUsage = (recordsToCreate) => {

    return new Promise((resolve, reject) => {


        const processRecord = (err, records) => {
            if (err) {
                reject(err);
                return;
            }

            console.log("New projected slot usage returned: " + JSON.stringify(records))
            resolve(records);
        };
        base('Projected Slot Usage').create(recordsToCreate, processRecord);
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

    await dataController.deleteAllRecords(base('Planting Requests'), "ID");
    await dataController.deleteAllRecords(base('Harvest Requests'), "HarvestRequestID");
    await dataController.deleteAllRecords(base('Planting Orders'), "ID");
    await dataController.deleteAllRecords(base('Harvest Orders'), "ID");
    await dataController.deleteAllRecords(base('Projected Slot Usage'), "ID");
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
    console.log("calculatePreviousMondayOrThursday day: ", day)
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
    // console.log("get total days crop: ", crops, cropId)
    let foundCrop = crops.find((crop) => {
        return crop.id === cropId
    });
    // console.log("Total days for crop: " + foundCrop.commonName + " - " + foundCrop.days);
    return foundCrop.days;
};

function createHarvestRequests2(ordersToProcess, crops, cutoffDate) {

    let promises = [];
    let harvestRequests = [];
    ordersToProcess.map((order) => {

        let totalDays = getTotalDays(crops, order.Crop[0]);
        let plantingDate, harvestDate;


        if (order["Order Type"] === "One off") {
            let harvestDate = moment(order["First Delivery"])
            plantingDate = calculatePreviousMondayOrThursday(moment(harvestDate).subtract(totalDays, 'days'));
            harvestRequests.push({
                fields: {
                    "Customer": order.Company,
                    "Crop": order.Crop,
                    "Amount (g)": order['Grams'],
                    "Date": harvestDate.format('MM/DD/YYYY'),
                    "Order ID": [order.id],
                }
            })
        } else if ((order["Order Type"] === "On Hold") || (order["Order Type"] === "On Hold Soon")) {
            // do nothing
        } else {
            const nextDeliveryDay = calculateNextDeliveryDay(order["Day Delivered"]);
            const today = moment(new Date());
            const plantingCutoff = today.subtract(5, 'weeks');
            console.log("Next Delivery Day: " + nextDeliveryDay);
            // let harvestDate = nextDeliveryDay - getTotalDays(order.Crop[0]);
            // let harvestDate = moment(nextDeliveryDay).subtract(totalDays, 'days');
            harvestDate = moment(nextDeliveryDay);
            while (harvestDate.isSameOrBefore(cutoffDate, 'days')) {
                plantingDate = calculatePreviousMondayOrThursday(moment(harvestDate).subtract(totalDays, 'days'));
                if (plantingDate.isSameOrAfter(plantingCutoff, 'days')) {
                    harvestRequests.push({
                        fields: {
                            "Customer": order.Company,
                            "Crop": order.Crop,
                            "Amount (g)": order['Grams'],
                            "Date": harvestDate.format('MM/DD/YYYY'),
                            "Order ID": [order.id],
                        }
                    })
                    // console.log("Harvest: " + JSON.stringify(harvest))
                    // plantingRequest = await createPlantingRequest(harvest.id, order.Crop, order['Amount (g)'], plantingDate.format('MM/DD/YYYY'))
                    // await addPlantingRequestToOrders(plantingRequest);
                }
                harvestDate.add(7, 'days');
            }
        }

    });
    console.log("Harvest Requestszzz: " + harvestRequests.length + " " + JSON.stringify(harvestRequests))
    return dataController.createRecordsBatch(base('Harvest Requests'), harvestRequests)
    // createHarvestRequestsBulk(harvestRequests);
}


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
                order['Grams'],
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
                        order['Grams'],
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

const loadOrders = async (options) => {
    const Orders = await dataController.getAirtableRecords(base('Orders'), options);
    console.log("retrievedOrders: " + Orders.length + " " + JSON.stringify(Orders))
    const procesedOrders = Orders.map(order => {
        const id = {id: order.id};
        const fields = order.fields;

        return {
            ...id,
            ...fields
        };
    })
    console.log("Processed Orders: " + JSON.stringify(procesedOrders))
    return procesedOrders;
};

const loadCompanies = async (options) => {
    const Companies = await dataController.getAirtableRecords(base('Companies'), options);

    return Companies.map(company => {
        return {
            id: company.id,
            name: company.fields.Name
        };
    });

};

const lookupCompanyNameById = (id, companies) => {
    // console.log("Name lookup id : " + id);
    // let company = companies.find(x => x.id === 'rec0NTUYoKazmQ4n1')
    let name = ""

    for (var i = 0; i < companies.length; i++) {
        // console.log("Equality:***" + id + "*****" + companies[i].id + "********")
        if (companies[i].id == id) {
            name = companies[i].name
            break;
        }
    }

    // console.log("Company: " + JSON.stringify(company))
    // let name = company.name
    // console.log("Name lookup: " + name);
    return name.substring(0, 3)
}


const globalCutOffDate = moment(new Date()).add(8, 'weeks');


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


    deleteRecordsTestBatch: async (req, res) => {
        await dataController.deleteTwoRecordsBatch(base('Planting Orders'));
        res.json("Records deleted");
    },

    deleteRecordsTestIndividualy: async (req, res) => {
        await dataController.deleteTwoRecordsIndividualy(base('Planting Requests'));
        res.json("Records deleted");
    },


    addHarvestRequests: async (req, res) => {

        await deleteRecords();

        const crops = await getCropInformation();
        console.log("Crops: " + crops)

        let cutOffDateFromPost = new Date(req.body.cutOffDate);
        console.log("Cutoff date: " + cutOffDateFromPost);

        const OPTIONS = {
            // view: 'Grid view',
            pageSize: 24
        };

        let ordersToProcess = await loadOrders(OPTIONS)
        let companies = await loadCompanies(OPTIONS)

        console.log("Companies: " + JSON.stringify(companies));


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
                    requests: [plantingRequest.id],
                    customers: lookupCompanyNameById(plantingRequest.Customer, companies)
                }
                dateRequest.plantings.push(cropRequest)
            } else {
                cropRequest.amount += plantingRequest["Amount (g)"]
                cropRequest.requests.push(plantingRequest.id)
                cropRequest.customers += ", " + lookupCompanyNameById(plantingRequest.Customer, companies)
            }
            console.log("Planting Orders: " + JSON.stringify(plantingOrders));
        }

        let harvestOrders = []

        const addHarvestRequestToOrders = (harvestRequest) => {
            console.log("incoming harvest reqeust: " + JSON.stringify(harvestRequest))
            let dateRequest = harvestOrders.find(harvestOrder => harvestRequest.Date === harvestOrder.harvestDate)
            if (!dateRequest) {
                dateRequest = {harvestDate: harvestRequest.Date, harvests: []}
                harvestOrders.push(dateRequest)
            }
            console.log("Harvest Crop id: " + harvestRequest.Crop[0]);
            console.log("Harvests: " + harvestRequest.Crop[0]);
            let cropRequest = dateRequest.harvests.find(harvest => harvestRequest.Crop[0] === harvest.CropID[0]);
            if (!cropRequest) {
                cropRequest = {
                    CropID: harvestRequest.Crop,
                    amount: harvestRequest["Amount (g)"],
                    requests: [harvestRequest.id],
                    customers: lookupCompanyNameById(harvestRequest.Customer, companies)
                }
                dateRequest.harvests.push(cropRequest)
            } else {
                console.log("Found a matching harvest")
                cropRequest.amount += harvestRequest["Amount (g)"]
                cropRequest.requests.push(harvestRequest.id)
                cropRequest.customers += ", " + lookupCompanyNameById(harvestRequest.Customer, companies)
            }
            console.log("Harvest Orders: " + JSON.stringify(harvestOrders));
        }

        let harvestOrdersForCalendar = [];
        let plantingOrdersForCalendar = [];

        const self = this
        Promise.all(createHarvestRecords(ordersToProcess, crops, addPlantingRequestToOrders, cutoffDate))
            .then((harvestRequests) => {
                console.log("Harvest Requests: " + JSON.stringify(harvestRequests));
                let promises = harvestRequests.map((harvestRequest) => {
                    let totalDays = getTotalDays(crops, harvestRequest.Crop[0]);
                    let plantingDate = calculatePreviousMondayOrThursday(moment(harvestRequest.Date).subtract(totalDays, 'days'));
                    addHarvestRequestToOrders(harvestRequest)
                    return createPlantingRequest(harvestRequest.id, harvestRequest.Crop, harvestRequest['Amount (g)'], plantingDate.format('MM/DD/YYYY'))
                });
                console.log("Harvest Orders: " + JSON.stringify(harvestOrders))
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
                                    planting.requests,
                                    planting.customers))
                                plantingOrdersForCalendar.push({
                                    CropID: planting.CropID,
                                    numberOfFlats: flatsCalculations.numberOfFlats,
                                    plantingDate: plantingOrder.plantingDate
                                })
                            })
                        })
                        harvestOrders.forEach(harvestOrder => {
                            harvestOrder.harvests.forEach(harvest => {
                                let flatsCalculations = calculateNumberOfFlats(harvest.amount, harvest.CropID[0], crops)
                                let excess = flatsCalculations.excess;
                                console.log("Flats calcuations: " + JSON.stringify(flatsCalculations))
                                console.log("Extracted excess: " + excess)
                                promises.push(createHarvestOrder(
                                    harvest.CropID,
                                    flatsCalculations.numberOfFlats,
                                    harvestOrder.harvestDate,
                                    flatsCalculations.excess,
                                    harvest.requests,
                                    harvest.customers))
                                harvestOrdersForCalendar.push({
                                    CropID: harvest.CropID,
                                    numberOfFlats: flatsCalculations.numberOfFlats,
                                    harvestDate: harvestOrder.harvestDate
                                })
                            })
                        })

                        Promise.all(promises)
                            .then(plantingOrderReturn => {
                                let currentSlotUsage = []
                                let morePromises = []
                                let todaysPlantings = []
                                let todaysHarvests = []
                                let currentDateFormatted, plantingDateFormatted
                                const today = moment(new Date())
                                let currentDate = moment(today)
                                console.log("current date", currentDate, "Cut off date", globalCutOffDate)
                                while (currentDate.isSameOrBefore(globalCutOffDate, 'days')) {
                                    currentDateFormatted = moment(currentDate).format("YYYY-MM-DD")
                                    todaysPlantings = plantingOrdersForCalendar.filter(plantingOrder => {
                                        plantingDateFormatted = moment(plantingOrder.plantingDate).format("YYYY-MM-DD")
                                        // console.log("plantingDateFormatted", plantingDateFormatted, "currentDateFormatted", currentDateFormatted)
                                        // return moment(currentDate,"YYYY-MM-DD").isSame(moment(plantingOrder.plantingDate, "YYYY-MM-DD"), "day")
                                        return currentDateFormatted === plantingDateFormatted
                                    })
                                    console.log("current date: " + currentDate)
                                    console.log("todaysPlantings: ", todaysPlantings)
                                    todaysPlantings.forEach(planting => {
                                        let foundCrop = currentSlotUsage.find(crop => crop.CropID[0] === planting.CropID[0])
                                        if (foundCrop) {
                                            foundCrop.numberOfFlats += planting.numberOfFlats
                                            console.log("Found a crop in currentSlotUsage")
                                        } else {
                                            currentSlotUsage.push({
                                                CropID: planting.CropID,
                                                numberOfFlats: planting.numberOfFlats
                                            })
                                        }
                                        morePromises.push([createProjectedSlotUsage(currentSlotUsage)])

                                    })
                                    currentDate.add(1, 'days');
                                }
                                console.log("Current slot usage: " + JSON.stringify(currentSlotUsage))
                                console.log("Planting orders for calendar: " + JSON.stringify(plantingOrdersForCalendar))
                                console.log("Harvest orders for calendar: " + JSON.stringify(harvestOrdersForCalendar))
                                console.log("Planting Orders return: " + JSON.stringify(plantingOrderReturn));
                                res.json(ordersToProcess);
                            })
                    })
            })
            .catch(err => {
                console.log("Create harvest record promise error: " + JSON.stringify(err));
                res.status(422).json(err)
            })
    },

    addHarvestRequests2: async (req, res) => {

        await deleteRecords();

        const crops = await getCropInformation();
        console.log("Crops: " + crops)

        let cutOffDateFromPost = new Date(req.body.cutOffDate);
        console.log("Cutoff date: " + cutOffDateFromPost);

        const OPTIONS = {
            // view: 'Grid view',
            pageSize: 24
        };

        let ordersToProcess = await loadOrders(OPTIONS)
        console.log("ordersToProcess: " + JSON.stringify(ordersToProcess))

        let companies = await loadCompanies(OPTIONS)
        console.log("Companies: " + JSON.stringify(companies));


        const cutoffDate = moment(new Date()).add(8, 'weeks');

        let plantingOrders = []
        let amount, customer, harvestDate, dayString


        const addPlantingRequestToOrders = (plantingRequest) => {
            console.log("incoming planting reqeust: " + JSON.stringify(plantingRequest))
            let dateRequest = plantingOrders.find(plantingOrder => plantingRequest.Date === plantingOrder.plantingDate)
            if (!dateRequest) {
                dateRequest = {plantingDate: plantingRequest.Date, plantings: []}
                plantingOrders.push(dateRequest)
            }
            console.log("Crop id: " + plantingRequest.Crop[0]);
            let cropRequest = dateRequest.plantings.find(planting => plantingRequest.Crop[0] === planting.CropID[0]);
            amount = plantingRequest["Amount (g)"];
            harvestDate = plantingRequest["Harvest Date"][0];
            dayString = moment(harvestDate).format("ddd").substring(0,1);
            customer = lookupCompanyNameById(plantingRequest.Customer, companies) + "-" + amount + dayString;
            console.log("customerzz: " + customer);
            if (!cropRequest) {
                cropRequest = {
                    CropID: plantingRequest.Crop,
                    amount: amount,
                    requests: [plantingRequest.id],
                    customers: customer
                }
                dateRequest.plantings.push(cropRequest)
            } else {
                cropRequest.amount += amount
                cropRequest.requests.push(plantingRequest.id)
                cropRequest.customers += ", " + customer
            }
            // console.log("Planting Orders: " + JSON.stringify(plantingOrders));
        }

        let harvestOrders = []

        const addHarvestRequestToOrders = (harvestRequest) => {
            console.log("incoming harvest reqeust: " + JSON.stringify(harvestRequest))
            let dateRequest = harvestOrders.find(harvestOrder => harvestRequest.Date === harvestOrder.harvestDate)
            if (!dateRequest) {
                dateRequest = {harvestDate: harvestRequest.Date, harvests: []}
                harvestOrders.push(dateRequest)
            }
            console.log("Harvest Crop id: " + harvestRequest.Crop[0]);
            console.log("Harvests: " + harvestRequest.Crop[0]);
            let cropRequest = dateRequest.harvests.find(harvest => harvestRequest.Crop[0] === harvest.CropID[0]);
            if (!cropRequest) {
                cropRequest = {
                    CropID: harvestRequest.Crop,
                    amount: harvestRequest["Amount (g)"],
                    requests: [harvestRequest.id],
                    customers: lookupCompanyNameById(harvestRequest.Customer, companies)
                }
                dateRequest.harvests.push(cropRequest)
            } else {
                console.log("Found a matching harvest")
                cropRequest.amount += harvestRequest["Amount (g)"]
                cropRequest.requests.push(harvestRequest.id)
                cropRequest.customers += ", " + lookupCompanyNameById(harvestRequest.Customer, companies)
            }
            console.log("Harvest Orders: " + JSON.stringify(harvestOrders));
        }

        let harvestOrdersForCalendar = [];
        let plantingOrdersForCalendar = [];
        let newPlantingOrders = [];
        let newHarvestOrders = [];

        const self = this
        let harvestRequestPromises = createHarvestRequests2(ordersToProcess, crops, cutoffDate)
        console.log("Create harvest requests promises:", harvestRequestPromises)
        Promise.all(harvestRequestPromises)
            .then((harvestRequests) => {
                const flattenedHarvestRequests = [].concat(...harvestRequests)
                console.log("Harvest Requests from main: " + " " + JSON.stringify(flattenedHarvestRequests));
                let plantingRequests = flattenedHarvestRequests.map((harvestRequest) => {
                    // console.log("Harvest request in map", JSON.stringify(harvestRequest))
                    // console.log("Crops in main: " + JSON.stringify(crops))
                    let totalDays = getTotalDays(crops, harvestRequest.Crop[0]);
                    // console.log("Harvest request in map", JSON.stringify(harvestRequest))
                    let plantingDate = calculatePreviousMondayOrThursday(moment(harvestRequest.Date).subtract(totalDays, 'days'));
                    console.log("Harvest request in map", JSON.stringify(harvestRequest))
                    addHarvestRequestToOrders(harvestRequest)
                    return {
                        fields: {
                            "Harvest Request": [harvestRequest.id],
                            "Crop": harvestRequest.Crop,
                            "Amount (g)": harvestRequest['Amount (g)'],
                            "Date": plantingDate.format('MM/DD/YYYY'),
                        }
                    }
                });
                console.log("Planting Requests from main: " + JSON.stringify(plantingRequests))
                Promise.all(dataController.createRecordsBatch(base('Planting Requests'), plantingRequests))
                    .then((plantingRequests) => {
                        console.log("Planting Requests: " + JSON.stringify(plantingRequests));
                        console.log("Orders processed: " + JSON.stringify(ordersToProcess[0]));
                        const flattenedPlantingRequests = [].concat(...plantingRequests)
                        flattenedPlantingRequests.forEach(plantingRequest => {
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
                                newPlantingOrders.push({
                                    fields: {
                                        "Crop": planting.CropID,
                                        "# of Flats": flatsCalculations.numberOfFlats,
                                        "Date": plantingOrder.plantingDate,
                                        "Excess": flatsCalculations.excess,
                                        "Amount": planting.amount,
                                        "Planting Requests": planting.requests,
                                        "Customers": planting.customers

                                    }
                                })

                                plantingOrdersForCalendar.push({
                                    CropID: planting.CropID,
                                    numberOfFlats: flatsCalculations.numberOfFlats,
                                    plantingDate: plantingOrder.plantingDate
                                })
                            })
                        })

                        promises.push(dataController.createRecordsBatch(base('Planting Orders'), newPlantingOrders))

                        harvestOrders.forEach(harvestOrder => {
                            harvestOrder.harvests.forEach(harvest => {
                                let flatsCalculations = calculateNumberOfFlats(harvest.amount, harvest.CropID[0], crops)
                                let excess = flatsCalculations.excess;
                                console.log("Flats calcuations: " + JSON.stringify(flatsCalculations))
                                console.log("Extracted excess: " + excess)

                                newHarvestOrders.push({
                                    fields: {
                                        "Crop": harvest.CropID,
                                        "# of Flats": flatsCalculations.numberOfFlats,
                                        "Date": harvestOrder.harvestDate,
                                        "Excess": flatsCalculations.excess,
                                        "Harvest Requests": harvest.requests,
                                        "Customers": harvest.customers
                                    }
                                })

                                harvestOrdersForCalendar.push({
                                    CropID: harvest.CropID,
                                    numberOfFlats: flatsCalculations.numberOfFlats,
                                    harvestDate: harvestOrder.harvestDate
                                })
                            })
                        })

                        promises.push(dataController.createRecordsBatch(base('Harvest Orders'), newHarvestOrders))

                        Promise.all(promises)
                            .then(plantingOrderReturn => {
                                let currentSlotUsage = [];
                                let morePromises = [];
                                let todaysPlantings = [];
                                let todaysHarvests = [];
                                let slotUsageByDay = [];
                                let todaysSlotUsage;
                                let currentDateFormatted, plantingDateFormatted, harvestDateFormatted;
                                const today = moment(new Date());
                                let currentDate = moment(today);
                                console.log("current date", currentDate, "Cut off date", globalCutOffDate);
                                while (currentDate.isSameOrBefore(globalCutOffDate, 'days')) {
                                    currentDateFormatted = moment(currentDate).format("YYYY-MM-DD")

                                    todaysPlantings = plantingOrdersForCalendar.filter(plantingOrder => {
                                        plantingDateFormatted = moment(plantingOrder.plantingDate).format("YYYY-MM-DD");
                                        // console.log("plantingDateFormatted", plantingDateFormatted, "currentDateFormatted", currentDateFormatted)
                                        // return moment(currentDate,"YYYY-MM-DD").isSame(moment(plantingOrder.plantingDate, "YYYY-MM-DD"), "day")
                                        return currentDateFormatted === plantingDateFormatted
                                    })

                                    console.log("current date: " + currentDate);
                                    console.log("todaysPlantings: " + JSON.stringify(todaysPlantings));
                                    todaysPlantings.forEach(planting => {
                                        // console.log("Todays' plantings - planting: " + JSON.stringify(planting))
                                        // console.log("Current slot usage: " + JSON.stringify(currentSlotUsage))
                                        let foundCrop = currentSlotUsage.find(crop => {
                                            // console.log("Cropzz: " + JSON.stringify(crop.Crop[0]))
                                            // console.log("Plantingzz: " + JSON.stringify(planting))
                                            return crop.Crop[0] === planting.CropID[0]
                                        });
                                        if (foundCrop) {
                                            foundCrop["# of Flats"] += planting.numberOfFlats;
                                            foundCrop["Flats Planted"] += planting.numberOfFlats;
                                            // console.log("Found a crop in currentSlotUsage")
                                        } else {
                                            // console.log("Adding to current slot usage array")
                                            currentSlotUsage.push({
                                                Crop: planting.CropID,
                                                "# of Flats": planting.numberOfFlats,
                                                "Flats Planted": planting.numberOfFlats
                                            })
                                        }
                                        // morePromises.push([createProjectedSlotUsage(currentSlotUsage)])

                                    })

                                    todaysHarvests = harvestOrdersForCalendar.filter(harvestOrder => {
                                        harvestDateFormatted = moment(harvestOrder.harvestDate).format("YYYY-MM-DD");
                                        // console.log("plantingDateFormatted", plantingDateFormatted, "currentDateFormatted", currentDateFormatted)
                                        // return moment(currentDate,"YYYY-MM-DD").isSame(moment(plantingOrder.plantingDate, "YYYY-MM-DD"), "day")
                                        return currentDateFormatted === harvestDateFormatted
                                    })

                                    todaysHarvests.forEach(harvest => {
                                        let foundCrop = currentSlotUsage.find(crop => {
                                            // console.log("Cropzz: " + JSON.stringify(crop.Crop[0]))
                                            // console.log("Plantingzz: " + JSON.stringify(harvest))
                                            return crop.Crop[0] === harvest.CropID[0]
                                        });
                                        if (foundCrop) {
                                            foundCrop["# of Flats"] -= harvest.numberOfFlats;
                                            foundCrop["Flats Harvested"] += harvest.numberOfFlats
                                            // console.log("Found a crop in currentSlotUsage")
                                        } else {
                                            // console.log("Adding to current slot usage array")
                                            currentSlotUsage.push({
                                                Crop: harvest.CropID,
                                                "# of Flats": -harvest.numberOfFlats,
                                                "Flats Harvested": harvest.numberOfFlats
                                            })
                                        }
                                        // morePromises.push([createProjectedSlotUsage(currentSlotUsage)])

                                    })

                                    todaysSlotUsage = currentSlotUsage.map(obj => (
                                        {fields: {...obj, "Date": currentDateFormatted}})
                                    )
                                    console.log("Today's slot usage: " + JSON.stringify(todaysSlotUsage))
                                    slotUsageByDay.push(todaysSlotUsage)
                                    //clear out the daily harvest and planting numbers
                                    currentSlotUsage.forEach(usage => {
                                        usage["Flats Harvested"] = 0
                                        usage["Flats Planted"] = 0
                                    })
                                    currentDate.add(1, 'days');
                                }
                                console.log("Slot usage by day: " + JSON.stringify([].concat(...slotUsageByDay)));
                                console.log("Planting orders for calendar: " + JSON.stringify(plantingOrdersForCalendar));
                                console.log("Harvest orders for calendar: " + JSON.stringify(harvestOrdersForCalendar));
                                console.log("Planting Orders return: " + JSON.stringify(plantingOrderReturn));
                                // Promise.all(dataController.createRecordsBatch(base("Projected Slot Usage"), [].concat(...slotUsageByDay)))
                                res.json(ordersToProcess);
                            })
                            .catch(err => {
                                console.log("Promise error: ", err);
                                res.status(422).json(err)
                            })
                    })
                    .catch(err => {
                        console.log("Create harvest record promise error: " + JSON.stringify(err));
                        res.status(422).json(err)
                    })
            })
            .catch(err => {
                console.log("Create harvest record promise error: " + JSON.stringify(err));
                res.status(422).json(err)
            })
    },

};

export {controller as default};
