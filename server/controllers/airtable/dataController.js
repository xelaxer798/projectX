const controller = {


    getAirtableRecords: (table, options) => {
        console.log("In data controller table: " + JSON.stringify(table) + " option: " + JSON.stringify(options))
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
};

export {controller as default};
