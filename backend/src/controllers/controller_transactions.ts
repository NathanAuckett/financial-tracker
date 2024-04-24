import {Request, Response} from 'express';
import {Op} from 'sequelize'
const { sq } = require('../config/db_sequelize');
const { Transaction, Category, BankAccount, CSVDictionary } = require('../models/');
const fs = require('fs');
const csv = require('csv-parse/sync');

import {query as queryGetDuplicateTransactions} from '../queries/query_transaction_get_duplicates';
import transactionsCalculateCategories from '../queries/query_all_transactions_calculate_categories';

async function uploadCSV(req:Request & {file?:object}, res:Response){
    let { user_id } = req.query;
    const csv_dictionary_id = 1;
    type FileType = {
        path: string
    }

    if (user_id === undefined){
        return res.status(400).json({
            error:"user_id is undefined"
        });
    }

    if (req.file === undefined){
        return res.status(400).json({
            error:"file is undefined"
        });
    }
    
    const file = req.file as FileType;

    await fs.readFile(file.path, "utf8", async (err:object[], data:string) => {
        if (err){
            console.log(err);
            return res.status(400).json({
                err
            });
        }

        fs.unlink(file.path, (err:object[]) => {
            if (err){
                console.log(err);
            }
        });
        
        let records = csv.parse(data, {columns: true, skip_empty_lines: true, cast: true});

        // const dict = {
        //     'BSB Number': "-1",
        //     'Account Number': 'account_number',
        //     'Transaction Date': 'transaction_date',
        //     'Narration': 'description',
        //     'Cheque Number': "-1",
        //     'Debit': 'debit',
        //     'Credit': 'credit',
        //     'Balance': 'balance',
        //     'Transaction Type': "-1"
        // }

        interface TranslationDictionary {
            [key:string]: string
        }
        interface Transaction {
            user_id: string
            transaction_date: string
        }
        function translateCSVFields(dataSet:Transaction[], translationDictionary:TranslationDictionary){
            const data = [];
            for (const entry of dataSet){
                const newObj: Record<string, string | null> = {}
                const keys = Object.keys(entry) as Array<keyof Transaction>;
                const translationKeys = Object.keys(translationDictionary) as string[];

                keys.forEach((key) => {
                    let newKey = "-1";
                    //Find key in dictionary based on key of this entry
                    for (let i = 0; i < translationKeys.length; i ++){
                        if (translationDictionary[translationKeys[i]] === key){
                            newKey = translationKeys[i];
                            break;
                        }
                    }
                    
                    if (newKey != "-1"){
                        newObj[newKey] = entry[key] as typeof Transaction;
                        
                        if (newObj[newKey] == ""){
                            newObj[newKey] = null;
                        }
                    }
                })
        
                data.push(newObj);
            }
            return data;
        }
        
        function addUserIDToTransactionObjects(dataSet:Transaction[], userID:string){
            for (const entry of dataSet){
                entry.user_id = userID;
            }
        }
        
        function convertDates(dataSet:Transaction[]){
            for (const entry of dataSet){
                const oldDate = entry.transaction_date;
                const dateSplit = oldDate.split("/");
                entry.transaction_date = dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];
            }
        }
        
        let dictionary = {};

        await CSVDictionary.findOne({
            attributes: ["bank_name", "account_number", "transaction_date", "credit", "debit", "description", "type", "balance"],
            where: {
                user_id: user_id,
                csv_dictionary_id: csv_dictionary_id
            }
        })
        .then((results:{dataValues:object}) => {
            dictionary = results.dataValues;
        })
        .catch((error:Error) => {
            return res.status(400).json({
                message: `Unable to find CSV dictionary with user_id:${user_id} and/or csv_dictionary_id:${csv_dictionary_id}`,
                error: error.message
            });
        });

        const accounts = await BankAccount.findAll({
            attributes: [
                "bank_account_id",
                "account_number"
            ],
            where: {
                user_id: user_id
            }
        })
        .catch((error:Error) => {
            return res.status(400).json({
                error: error.message
            });
        });

        console.log(dictionary);
        

        records = translateCSVFields(records, dictionary);
        addUserIDToTransactionObjects(records, user_id.toString());
        convertDates(records);
        interface transaction {
            bank_account_id: string,
            account_number: string
        }
    
        records.forEach((transaction:transaction) => {
            const accountNumber = accounts.length;
            for (let account = 0; account < accountNumber; account ++){
                if (transaction.account_number == accounts[account].account_number){
                    transaction.bank_account_id = accounts[account].bank_account_id;
                    break;
                }
            }
            if (transaction.bank_account_id == undefined){
                transaction.bank_account_id = "1";
            }
        });
    
        Transaction.bulkCreate(records)
        .then(() => {
            return res.status(201).json({
                message: 'Bulk Transactions created successfully'
            });
        })
        .catch((error:object[]) => {
            return res.status(400).json({
                error
            });
        });
    });
}


function addTransaction(req: Request, res: Response) { //Expects a transaction object
    Transaction.create(req.body)
    .then(() => {
        return res.status(201).json({
            message: 'Single Transaction created successfully'
        });
    })
    .catch((error:object[]) => {
        return res.status(400).json({
            error
        });
    });

    
}

async function addBulkTransactions(req: Request, res: Response) { //expects and array of transaction objects
    const { user_id } = req.query;
    const body = req.body;

    const accounts = await BankAccount.findAll({
        attributes: [
            "bank_account_id",
            "account_number"
        ],
        where: {
            user_id: user_id
        }
    });

    interface transaction {
        bank_account_id: string,
        account_number: string
    }

    body.forEach((transaction:transaction) => {
        const accountNumber = accounts.length;
        for (let account = 0; account < accountNumber; account ++){
            if (transaction.account_number == accounts[account].account_number){
                transaction.bank_account_id = accounts[account].bank_account_id;
            }
        }
    });

    Transaction.bulkCreate(req.body)
    .then(() => {
        return res.status(201).json({
            message: 'Bulk Transactions created successfully'
        });
    })
    .catch((error:object[]) => {
        return res.status(400).json({
            error
        });
    });
}

async function computeTransactionCategories(req: Request, res: Response){
    interface QueryRes {
        rowCount: number;
    }
    
    const { user_id } = req.query;
    
    if (user_id){
        await sq.query(transactionsCalculateCategories(user_id as unknown as number))
        .then((response:QueryRes[][]) => {
            const [results, metadata] = response;

            return res.status(201).json({
                message: `Categories computed for all user ${user_id} transactions!`,
                result: results,
                categoriesCleared: metadata[0].rowCount,
                categoriesApplied: metadata[1].rowCount
            });
        })
        .catch((error:object[]) => {
            return res.status(400).json({
                error
            });
        });
    }
    else{
        return res.status(400).json({
            message: "user_id not provided!",
            query: req.query
        });
    }
}

async function getAllTransactions(req: Request, res: Response){ //Returns all transactions in the DB
    const users = await Transaction.findAll();
    
    return res.status(201).json({
        message: 'Fetched all transactions successfully',
        users
    });
}

async function getDuplicates(req: Request, res: Response){ //returns duplicate transactions. Where, account id, credit, debit, purchase date and description all match exactly
    const [results, metadata] = await sq.query(queryGetDuplicateTransactions);

    return res.status(201).json({
        message: 'Duplicates searched and received',
        results
    });
}


async function getTransactions(req: Request, res: Response){
    const {limit, offset, user_id, category_ids, ...queries} = req.query;

    //split comma separated categories into array
    const categories = category_ids as string;
    let categoriesArray:string[] = [];
    if (categories){
        categoriesArray = categories.split(",");
    }

    const query = {
        limit: limit,
        offset: offset,
        where: {
            user_id: user_id,
            ...(queries ? { ...queries } : {}),
        },
        include: [
            {
                model: Category,
                ...(categories ? { //Only use where when category id's are provided
                    where: {
                        category_id: {
                            [Op.in]: categoriesArray
                        }
                    }
                } : {})
            },
            {
                model: BankAccount
            }
        ],
        order: [
            ["createdAt", "DESC"]
        ]
    }

    console.log(query);

    await Transaction.findAll(query)
    .then((response:object[]) => {
        // console.log(response);
        // let [results, metadata] = response;

        // if (results === undefined){
        //     results = [];
        // }
        // if (!Array.isArray(results)){
        //     results = [results];
        // }
        
        return res.status(201).json({
            message: `${response.length} of max ${limit} transactions for user_id ${user_id} fetched. Offset: ${offset}`,
            categories: categories ? categories : "not provided",
            transactions: response
        });
    })
    .catch((error:Error) => {
        return res.status(400).json({
            error: error.message
        });
    });
}


async function getTransactionsTotals(req: Request, res:Response){ //Gets totals for credit and debit based on user_id and optional account_id
    const {user_id, bank_account_id} = req.query;
    
    const totalCredit = await Transaction.sum("credit", {
        where: {
            user_id: user_id,
            ...(bank_account_id ? {account_id: bank_account_id} : {})
        }
    });
    const totalDebit = await Transaction.sum("debit", {
        where: {
            user_id: user_id,
            ...(bank_account_id ? {account_id: bank_account_id} : {})
        }
    });

    return res.status(201).json({
        message: `Totals calculated`,
        account_id: bank_account_id ? bank_account_id : "Not provided",
        totalCredits: totalCredit,
        totalDebits: totalDebit,
        totalsCombined: totalCredit + totalDebit
    });
}

module.exports = {
    addTransaction,
    addBulkTransactions,
    getAllTransactions,
    getDuplicates,
    getTransactions,
    computeTransactionCategories,
    getTransactionsTotals,
    uploadCSV
}