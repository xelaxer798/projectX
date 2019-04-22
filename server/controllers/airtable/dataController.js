const controller = {


    getAirtableRecords: (table, options) => {
        // console.log("In data controller table: " + JSON.stringify(table) + " option: " + JSON.stringify(options))
        let records = [],
            params = {
                // view: 'Grid View',
                pageSize: 16
            };
        Object.assign(params, options);
        return new Promise((resolve, reject) => {
            // Cache results if called already
            if (records.length > 0) {
                resolve(records);
            }

            const processPage = (partialRecords, fetchNextPage) => {
                records = [...records, ...partialRecords];
                fetchNextPage();
            };

            const processRecords = (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(records);
            };

            table.select(params).eachPage(processPage, processRecords);
        });
    },

    deleteRecord: (table, recordId) => {

        return new Promise((resolve, reject) => {
            table.destroy(recordId, function (err, deletedRecord) {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                console.log('Deleted record', deletedRecord.id);
                resolve(deletedRecord.id);
            });
        })

    },

    deleteAllRecords: async (table) => {
        const records =  await controller.getAirtableRecords(table, {});
        records.forEach(async (record) => {
            await controller.deleteRecord(table, record.id)
        })
    }

};

export {controller as default};
