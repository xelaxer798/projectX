function deleteRecords(table, recordIds) {
    console.log("in deleteRecords: table " + JSON.stringify(table));
    console.log("in deleteRecords: recordIds ", recordIds);
    return new Promise((resolve, reject) => {
        table.destroy(recordIds, function (err, deletedRecords) {
            if (err) {
                console.log("deleteRecords error: " + JSON.stringify(err));
                reject("Delete Records error: " + JSON.stringify(err));
                return;
            }
            console.log('deleteRecords', JSON.stringify(deletedRecords));
            resolve(deletedRecords);
        });
    })

}

const controller = {


    getAirtableRecords: (table, options) => {
        // console.log("In data controller table: " + JSON.stringify(table) + " option: " + JSON.stringify(options))
        let records = [],
            params = {
                // view: 'Grid View',
                pageSize: 16
            };
        Object.assign(params, options);
        console.log("getAirtableRecords options", params)
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

            table.select().eachPage(processPage, processRecords);
            console.log("Do we ever get here")
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

    deleteRecordsBatch: (table, records) => {

        let promises = []
        let setsOfRecordsToDelete = [[]]

        // recordIds.forEach(id => {
        //     recordsToDelete.push(id)
        //     // console.log("deleteRecordsBatch create promise: " + JSON.stringify(recordsToDelete))
        //     if (recordsToDelete.length >= 10) {
        //         console.log("deleteRecordsBatch create promise: " + JSON.stringify(recordsToDelete))
        //         // promises.push(this.deleteRecords(table, recordsToDelete))
        //         recordsToDelete = [];
        //     }
        // })
        let currentRecordSet = 0;
        for (let i = 0; i < records.length; i++) {
            setsOfRecordsToDelete[currentRecordSet].push(records[i].id)
            if (setsOfRecordsToDelete[currentRecordSet].length >= 10) {
                setsOfRecordsToDelete.push([])
                currentRecordSet++

                // promises.push(() => deleteRecords(table, ["skdfsdf salf lashf"]))
                // console.log("deleteRecordsBatch create promise after push: " + JSON.stringify(promises))
                // recordsToDelete = [];
            }
        }

        // recordIds.map(recordId => {
        //     recordsToDelete.push(recordId)
        //     if (recordsToDelete.length >= 10) {
        //         console.log("deleteRecordsBatch create promise: " + JSON.stringify(recordsToDelete))
        //         promises.push(() => deleteRecords(table, recordsToDelete))
        //         console.log("deleteRecordsBatch create promise after push: " + JSON.stringify(promises))
        //         recordsToDelete = [];
        //     }
        // })

        // if (recordsToDelete.length > 0) {
        //     promises.push(() => deleteRecords(table, ["zzzzzzzzzz"]))
        //     console.log("deleteRecordsBatch create promise left over: " + JSON.stringify(recordsToDelete))
        // }

        console.log("Sets of records to delete: " + JSON.stringify(setsOfRecordsToDelete))

        setsOfRecordsToDelete.forEach(setOfRecordIds => {
            promises.push(() => deleteRecords(table, setOfRecordIds))
        })

        console.log("Promises: " + JSON.stringify(promises))

        const arrayOfPromises = promises.map(task => task())

        // Promise.all(arrayOfPromises)
        //     .then(data => {
        //         console.log("Data from delete promises", data)
        //         return data
        //     })
        //     .catch(error => {
        //         console.log("Error from delete promies", error)
        //         return error;
        //     })

    },

    // deleteAllRecords: async (table, idField) => {
    //     const records = await controller.getAirtableRecords(table, {});
    //     console.log("Delete all records return records:" + JSON.stringify(records));
    //     let recordIds = [];
    //     records.forEach((record) => {
    //         recordIds.push(record.id)
    //     })
    //     console.log("deleteAllRecords: " + JSON.stringify(recordIds))
    //     await controller.deleteRecordsBatch(table, recordIds)
    //
    // }

    deleteAllRecords: async (table) => {
        const records = await controller.getAirtableRecords(table, {});
        controller.deleteRecordsBatch(table, records)
        // records.forEach(async (record) => {
        //     await controller.deleteRecord(table, record.id)
        // })
    },

    deleteTwoRecordsBatch: async (table) => {
        const records = await controller.getAirtableRecords(table, {});
        await controller.deleteRecordsBatch(table, records)
        // let recordsToDelete = [];
        // recordsToDelete.push(records[0].id)
        // recordsToDelete.push(records[1].id)
        // await deleteRecords(table, recordsToDelete)
    },

    deleteTwoRecordsIndividualy: async (table) => {
        const records = await controller.getAirtableRecords(table, {});
        await deleteRecords(table, records[0].id);
        await deleteRecords(table, records[1].id);
    }


};

export {controller as default};
