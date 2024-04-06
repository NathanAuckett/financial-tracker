const fs = require('fs');
const csv = require('csv-parse/sync');


const contents = fs.readFileSync("./data.csv", 'utf8');

let records = csv.parse(contents, {columns: true, skip_empty_lines: true, cast: true});

function translateCSVFields(dataSet, translationDictionary){
    const data = [];
    for (const entry of dataSet){
        const newObj = {}
        const keys = Object.keys(entry);

        keys.forEach((key) => {
            const newKey = translationDictionary[key];
            if (newKey != -1){
                newObj[newKey] = entry[key];
                
                if (newObj[newKey] == ""){
                    newObj[newKey] = null;
                }
            }
        })

        data.push(newObj);
    }
    return data;
}

function addUserIDToTransactionObjects(dataSet, userID){
    for (const entry of dataSet){
        entry.user_id = userID;
        entry.account_id = 1;
    }
}

function convertDates(dataSet){
    for (const entry of dataSet){
        const oldDate = entry.transaction_date;
        const dateSplit = oldDate.split("/");
        entry.transaction_date = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];
    }
}

//Used to translate CSV titles into expected database fields
const dict = {
    'BSB Number': -1,
    'Account Number': 'account_number',
    'Transaction Date': 'transaction_date',
    'Narration': 'description',
    'Cheque Number': -1,
    'Debit': 'debit',
    'Credit': 'credit',
    'Balance': -1,
    'Transaction Type': -1
}


records = translateCSVFields(records, dict);
addUserIDToTransactionObjects(records, 1);
convertDates(records);

//null value in column "account_id" of relation "transaction" violates not-null constraint

fs.writeFileSync('./JSON From CSV.txt', JSON.stringify(records));
