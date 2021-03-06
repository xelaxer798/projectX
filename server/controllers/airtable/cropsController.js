import Airtable from 'airtable'
import dataController from "./dataController"
import Functions from "../../Functions"
import pdfMakePrinter from 'pdfmake/src/printer'
import path from 'path'


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
};

const generatePdf = (docDefinition, callback) => {
    try {
        const fontDirectory = 'server/Fonts/Roboto'
        const fontDescriptors = {
            Roboto: {
                normal: path.join(fontDirectory,'Roboto-Regular.ttf'),
                bold: path.join(fontDirectory,'Roboto-Medium.ttf'),
                italics: path.join(fontDirectory,'Roboto-Italic.ttf'),
                bolditalics: path.join(fontDirectory,'Roboto-MediumItalic.ttf')
            }};
        const printer = new pdfMakePrinter(fontDescriptors);
        const doc = printer.createPdfKitDocument(docDefinition);

        let chunks = [];

        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        doc.on('end', () => {
            callback(Buffer.concat(chunks));
            // const result = Buffer.concat(chunks);
            // callback('data:application/pdf;base64,' + result.toString('base64'));
        });

        doc.end();

    } catch(err) {
        throw(err);
    }
};

const controller = {

    getCrops: async (req, res) => {

        const OPTIONS = {
            // view: 'Grid view',
            pageSize: 24
        };

        const TABLE = base('Crop Recipes');
        const crops = await dataController.getAirtableRecords(TABLE, OPTIONS);

        // const COUNT = crops.length,
        //     PAGES = Math.ceil(COUNT / OPTIONS.pageSize),
        //     OFFSET = (page * OPTIONS.pageSize) - OPTIONS.pageSize;

        // console.log("Crops: " + JSON.stringify(crops));

        let returnValues = crops.map(crop => {
            return {
                id: crop.getId(),
                commonName: crop.get('Common Name'),
                plantings: crop.get('Plantings'),
                sortName: crop.get('Sort Name')
                // pages: PAGES
            };
        });
        console.log("Crops processed: " + JSON.stringify(returnValues[0]));
        res.json(returnValues);
    },


    getCropPrices: async (req, res) => {

        let status = req.body.status;

        const OPTIONS = {
            // view: 'Grid view',
            pageSize: 24
        };

        const TABLE = base('Crop Recipes');
        const crops = await dataController.getAirtableRecords(TABLE, OPTIONS);

        // const COUNT = crops.length,
        //     PAGES = Math.ceil(COUNT / OPTIONS.pageSize),
        //     OFFSET = (page * OPTIONS.pageSize) - OPTIONS.pageSize;

        // console.log("Crops: " + JSON.stringify(crops));

        let returnValues = crops.map(crop => {
            return {
                cropId: crop.getId(),
                commonName: crop.get('Common Name'),
                pricing: crop.get('💰price/4 oz'),
                sortName: crop.get('Sort Name'),
                status: crop.get("Status")
                // pages: PAGES
            };
        });
        let filteredReturnValues = [];
        console.log("Status: " + status);
        if (status) {
            filteredReturnValues = returnValues.filter(crop => {
                return status === crop.status;
            });

        } else {
            filteredReturnValues = returnValues;
        }
        console.log("Crops processed: " + JSON.stringify(filteredReturnValues[0]));

        res.json(filteredReturnValues.sort(Functions.compareValues("sortName")));
    },

    createPricingReport: async (req, res) => {
        const docDefinition = {
            content: ['This will show up in the file created']
        };

        generatePdf(docDefinition, (response) => {
            res.setHeader('Content-Type', 'application/pdf');
            res.send(response); // sends a base64 encoded string to client
        });
    },


    getPlantings: async (req, res) => {

        let plantingIds = req.body.plantings;

        const OPTIONS = {
            view: 'Harvest Weight Summary',
            pageSize: 24,
        };

        const TABLE = base('Planting Log');
        const plantings = await dataController.getAirtableRecords(TABLE, OPTIONS);

        // const COUNT = crops.length,
        //     PAGES = Math.ceil(COUNT / OPTIONS.pageSize),
        //     OFFSET = (page * OPTIONS.pageSize) - OPTIONS.pageSize;


        let returnValues = plantings.map(planting => {
            // let germLocation = dealWithLocationBlanks(planting.get('Germ. Location'));
            // if(!germLocation) {
            //     germLocation="undefined"
            // }
            // if(harvestWeight.specialValue) { //we have NaN
            //     console.log("zPlanting NaN" + harvestWeight)
            //     harvestWeight = 0
            // }
            // console.log("zPlantings germ location: " + JSON.stringify(germLocation));

            return {
                plantingId: planting.getId(),
                dateSowed: planting.get('Date Sowed'),
                harvestDate: planting.get('Harvest Date Actual'),
                firstLightDate: planting.get('First Light Act'),
                germLocation: dealWithLocationBlanks(planting.get('Germ. Location')),
                greenhouseLocation: dealWithLocationBlanks(planting.get('GH Location')),
                harvestWeight: dealWithNaN(planting.get('H wt.')),
                totalDays: dealWithNaN(planting.get('Tot. Days')),
                darkDays: dealWithNaN(planting.get('Dark Days')),
                substrate: planting.get('Substrate'),
                notes: planting.get('Notes')

                // pages: PAGES
            };
        });

        let filteredReturnValues = returnValues.filter(planting => {
            return plantingIds.includes(planting.plantingId);
        })
        console.log("zPlanting return value: " + JSON.stringify(returnValues));
        res.json(filteredReturnValues);
    }


    // base('Crop Recipes').select({
    //     // Selecting the first 3 records in Grid view:
    //     maxRecords: 100,
    //     // view: "Grid view"
    // }).eachPage(function page(records, fetchNextPage) {
    //     // This function (`page`) will get called for each page of records.
    //
    //     records.forEach(function (record) {
    //         console.log('Retrieved', record);
    //     });
    //
    //     // To fetch the next page of records, call `fetchNextPage`.
    //     // If there are more records, `page` will get called again.
    //     // If there are no more records, `done` will get called.
    //     fetchNextPage();
    //
    // }, function done(err) {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    // });


//     let records = [];
//     const crops = await dataController.getAirtableRecords(TABLE, OPTIONS);
//
//     const count = crops.length,
//         pages = Math.ceil(count / OPTIONS.pageSize),
//         offset = (page * OPTIONS.pageSize) - OPTIONS.pageSize;
//
//     return crops.map( crop => {
//         return {
//             id: crop.getId(),
//             commonName: crop.get('Common Name'),
//             plantings: crop.get('Plantings'),
//             pages
//         }
//     }).slice(offset, OPTIONS.pageSize*page);
// }

};

export {controller as default};
