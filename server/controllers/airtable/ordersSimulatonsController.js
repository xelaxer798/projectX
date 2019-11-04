import Airtable from 'airtable'
import dataController from "./dataController"
import moment from 'moment'

const SUNDAY = 0;
const MONDAY = 1;
const TUESDAY = 2;
const WEDNESDAY = 3;
const THURSDAY = 4;
const FRIDAY = 5;
const SATURDAY = 6;

const GERMINATOR = "Germinator";
const GREENHOUSE = "Greenhouse";
const HARVEST = "Harvest";
const PAST_HARVEST = "Past Harvest";

const base = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

const deleteRecords = async () => {
    await dataController.deleteAllRecords(base('Projected Slot Usage'), "ID");
};

const sumPropertyValue = (items, prop) => items.reduce((a, b) => a + b[prop], 0);

const findNextDayOfWeek = (day) => {
    const today = moment().isoWeekday();

// if we haven't yet passed the day of the week that I need:
    if (today <= day) {
        // then just give me this week's instance of that day
        return moment().isoWeekday(day);
    } else {
        // otherwise, give me *next week's* instance of that same day
        return moment().add(1, 'weeks').isoWeekday(day);
    }
}

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
            darkDays: Math.ceil(crop.get('Average Dark Days')),
            days: Math.ceil(crop.get('Ave. G. Tot Days')),
            averageHarvestWeight: crop.get('Avg. Good H wt')
        }
    });
};

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
    return procesedOrders.filter(order => {
        return order['Order Type'] === "Repeating"
    });
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

const getTotalDays = (crops, cropId) => {
    // console.log("get total days crop: ", crops, cropId)
    let foundCrop = crops.find((crop) => {
        return crop.id === cropId
    });
    // console.log("Total days for crop: " + foundCrop.commonName + " - " + foundCrop.days);
    return foundCrop.days;
};

const getCropField = (crops, cropId, fieldName) => {
    // console.log("get total days crop: ", crops, cropId)
    let foundCrop = crops.find((crop) => {
        return crop.id === cropId
    });
    // console.log("Total days for crop: " + foundCrop.commonName + " - " + foundCrop.days);
    return foundCrop[fieldName];
};

const addPlantingDayToOrders = (orders, crops) => {
    let projectedPlantingDay, deliveryDate;
    orders.forEach(order => {
        if (order['Day Delivered'] === "Friday") {
            deliveryDate = moment().day(FRIDAY)
            order['harvestDay'] = FRIDAY
        } else {
            deliveryDate = moment().day(TUESDAY)
            order['harvestDay'] = TUESDAY
        }
        projectedPlantingDay = deliveryDate.subtract(getTotalDays(crops, order.Crop[0]))
        order['plantingDay'] = calculatePreviousMondayOrThursday(projectedPlantingDay).day()

    })
};

const reduceOrders = (orders, day) => {
    if (day === MONDAY || day === THURSDAY) {
        return orders.filter(order => {
            return order.plantingDay === day
        })
    } else if (day === TUESDAY || day === FRIDAY) {
        return orders.filter(order => {
            return order.harvestDay === day
        })
    } else {
        return []
    }
};

const reducePlantings = (plantings, fieldName, value) => {
    return plantings.filter(planting => {
        return planting[fieldName] === value
    })
}

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

const processDailySlotUsage = (dailySlotUsage, formattedCurrentDay, slotUsage, location, currentDay) => {
    const reducedPlantings = reducePlantings(slotUsage.plantings, "location", location);
    console.log("slotUsagezz: " + JSON.stringify(slotUsage));
    console.log("reducedSlots: " + JSON.stringify(reducedPlantings));
    if (reducedPlantings.length > 0) {
        // reducedPlantings.forEach(planting =>{
        //     dailySlotUsage.push({
        //         fields: {
        //             Date: formattedCurrentDay,
        //             Crop: slotUsage.Crop,
        //             Location: location,
        //             temp : slotUsage["Crop Name"][0],
        //             "# of Flats": planting.numberOfFlats,
        //             "Day Planted": planting.dayPlanted,
        //             "Total Days": planting.totalDays,
        //             "Harvest Day": planting.harvestDay,
        //             "Dark Days": planting.darkDays,
        //             "Current Day": currentDay,
        //             Excess: planting.Excess
        //         }
        //     });
        //
        // })
        dailySlotUsage.push({
            fields: {
                Date: formattedCurrentDay,
                Crop: slotUsage.Crop,
                Location: location,
                temp : slotUsage["Crop Name"][0],
                "Current Day" : currentDay,
                "# of Flats": sumPropertyValue(reducedPlantings, "numberOfFlats"),
                Excess: Math.round(sumPropertyValue(reducedPlantings, "Excess"))
            }
        });
    }
    console.log("End of processDailySlotUsage")
};


const aggregateDailyPlantings = (orders, crops) => {
    let dailyPlantings = [];
    let foundCrop;
    let flatsCalculations;

    console.log("In aggregate: " + JSON.stringify(dailyPlantings))

    orders.forEach(order => {
        foundCrop = dailyPlantings.find(dailyPlanting => {
            return dailyPlanting.Crop[0] === order.Crop[0]
        });
        console.log("Found Crop: " + JSON.stringify(foundCrop))
        console.log("Order: " + JSON.stringify(order))
        if (foundCrop) {
            foundCrop["Grams"] += order["Grams"]
        } else {
            dailyPlantings.push({
                Crop: order.Crop,
                "Crop Name": order["Common Name"],
                Grams: order.Grams,
            })
        }
        console.log("In aggregate: " + JSON.stringify(dailyPlantings))

    });
    //calculate # of flats
    console.log("In aggregate: " + JSON.stringify(dailyPlantings))
    dailyPlantings.forEach(dailyPlanting => {
        flatsCalculations = calculateNumberOfFlats(dailyPlanting.Grams, dailyPlanting.Crop[0], crops);
        dailyPlanting.numberOfFlats = flatsCalculations.numberOfFlats;
        dailyPlanting.excess = flatsCalculations.excess;
    });

    return dailyPlantings;

};

const getHarvestDay = (currentDay, totalDays) => {
    const harvestDay = currentDay + totalDays;
    const harvestDayOfWeek = harvestDay % 7;
    switch (harvestDayOfWeek) {
        case SUNDAY:
            return harvestDay + 2;
        case MONDAY:
            return harvestDay + 1;
        case TUESDAY:
            return harvestDay;
        case WEDNESDAY:
            return harvestDay + 2;
        case THURSDAY:
            return harvestDay + 1;
        case FRIDAY:
            return harvestDay;
        case SATURDAY:
            return harvestDay + 3;
        default:
            console.log("getHarvestDay currentDay: " + currentDay + "  totalDays: " + totalDays)
            return harvestDay;
    }
};

const calculatePreviousMondayOrThursday = (day) => {
    console.log("calculatePreviousMondayOrThursday day: ", day);
    let offset = 0;
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

const controller = {


    runSlotAnalysis: async (req, res) => {

        const numberOfDaysToSimulate = 80;

        let dailySlotUsage = [];

        await deleteRecords();

        const crops = await getCropInformation();
        console.log("Crops: " + JSON.stringify(crops));

        let orders = await loadOrders({});
        console.log("ordersToProcess: " + JSON.stringify(orders));

        let companies = await loadCompanies({});
        console.log("Companies: " + JSON.stringify(companies));

        addPlantingDayToOrders(orders, crops);
        console.log("ordersToProcess after addition: " + JSON.stringify(orders));

        let plantingOrders, dailyPlantings, formattedCurrentDay, foundSlotUsage, currentPlanting;
        let currentDay = findNextDayOfWeek(MONDAY);
        let currentSlotUsage = [];
        let dayOfWeek;
        for (let day = 1; day < numberOfDaysToSimulate; day++) {
            formattedCurrentDay = moment(currentDay).format('MM/DD/YYYY');
            dayOfWeek = currentDay.day();
            console.log("Date: " + formattedCurrentDay + " Day of week: " + dayOfWeek);

            //process daily bring to light and harvest
            currentSlotUsage.forEach(usage => {
                usage.plantings.forEach(planting => {
                    console.log(usage["Crop Name"] + "zz Current Day: " + day + " Day Planted: " + planting.dayPlanted + " Dark days" + planting.darkDays )
                    if (planting.location === GERMINATOR && ((day - planting.dayPlanted) >= planting.darkDays)) {
                        console.log("Usagezz: " + JSON.stringify(usage))
                        console.log(usage["Crop Name"] + " Current Day: " + day + " Day Planted: " + planting.dayPlanted + " Dark days" + planting.darkDays )
                        planting.location = GREENHOUSE
                    } else if (day  === planting.harvestDay) {
                        planting.location = HARVEST
                    } else if (day  > planting.harvestDay) {
                        planting.location = PAST_HARVEST
                    }
                })
                //remove past harvests
                usage.plantings = usage.plantings.filter(planting => {
                    return planting.location !== PAST_HARVEST
                })
            });


            if (dayOfWeek === MONDAY || dayOfWeek === THURSDAY) {
                //we have a planting day
                plantingOrders = reduceOrders(orders, dayOfWeek);
                console.log("Planting Orders: " + JSON.stringify(plantingOrders));
                dailyPlantings = aggregateDailyPlantings(plantingOrders, crops);
                console.log("Daily Plantings: " + JSON.stringify(dailySlotUsage));

                dailyPlantings.forEach(dailyPlanting => {
                    console.log("In Daily planting loop: " + JSON.stringify(dailyPlanting));
                    foundSlotUsage = currentSlotUsage.find(usage => {
                        return usage.Crop[0] === dailyPlanting.Crop[0]
                    });
                    let totalDays = getCropField(crops, dailyPlanting.Crop[0], "days");

                    currentPlanting = {
                        numberOfFlats: dailyPlanting.numberOfFlats,
                        Excess: dailyPlanting.excess,
                        dayPlanted: day,
                        totalDays: totalDays,
                        harvestDay: getHarvestDay(day, totalDays),
                        darkDays: getCropField(crops, dailyPlanting.Crop[0], "darkDays"),
                        location: GERMINATOR
                    };
                    console.log("Current Planting: " + JSON.stringify(currentPlanting));

                    if (foundSlotUsage) {
                        foundSlotUsage.plantings.push(currentPlanting)
                        console.log("Found slot usage: " + JSON.stringify(foundSlotUsage));
                    } else {
                        console.log("Found slot usage: " + JSON.stringify(foundSlotUsage));
                        currentSlotUsage.push({
                            Crop: dailyPlanting.Crop,
                            "Crop Name": dailyPlanting["Crop Name"],
                            plantings: [currentPlanting]
                        })
                    }
                })
            }
            console.log("Current Slot Usage: " + JSON.stringify(currentSlotUsage));
            currentSlotUsage.forEach(slotUsage => {
                console.log("slotUsage: " + JSON.stringify(slotUsage));

                processDailySlotUsage(dailySlotUsage, formattedCurrentDay, slotUsage, GERMINATOR, day);
                processDailySlotUsage(dailySlotUsage, formattedCurrentDay, slotUsage, GREENHOUSE, day);
                processDailySlotUsage(dailySlotUsage, formattedCurrentDay, slotUsage, HARVEST, day);

            });
            currentDay.add(1, 'days');
        }

        console.log("Daily slot usage: " + JSON.stringify(dailySlotUsage));

        Promise.all(dataController.createRecordsBatch(base("Projected Slot Usage "), dailySlotUsage))
            .then(results => {
                res.json(results);
            })
            .catch(err => {
                console.log("Promise error: ", err);
                res.status(422).json(err)
            })

    }

};

export {controller as default};
