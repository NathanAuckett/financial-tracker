import {Request, Response} from 'express';
const { sq } = require('../config/db_sequelize');
const { Transaction } = require('../models/');

import {query as queryGetDuplicateTransactions} from '../queries/query_transaction_get_duplicates';
import transactionsCalculateCategories from '../queries/query_all_transactions_calculate_categories';


function addTransaction(req: Request, res: Response) { //Expects a transaction object
    Transaction.create(req.body);

    return res.status(201).json({
        message: 'Single Transaction created successfully'
    });
}

function addBulkTransactions(req: Request, res: Response) { //expects and array of transaction objects
    Transaction.bulkCreate(req.body);

    return res.status(201).json({
        message: 'Bulk Transactions created successfully'
    });
}

async function computeTransactionCategories(req: Request, res: Response){
    const { user_id } = req.query;
    
    if (user_id){
        const [results, metadata] = await sq.query(transactionsCalculateCategories(user_id as unknown as number));

        return res.status(201).json({
            message: `Categories computed for all user ${user_id} transactions!`,
            categoriesCleared: metadata[0].rowCount,
            categoriesApplied: metadata[1].rowCount
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

async function getTransactions(req: Request, res: Response){ //returns all transactions that match query parameters in request
    const transactions = await Transaction.findAll({
        where: req.query
    });

    return res.status(201).json({
        message: 'Transactions feteched',
        transactions
    });
}

async function getTransactionsForUserLimited(req: Request, res: Response){ //takes a user_id, limit and offset > returns limit of transactions, page offset by offset, with the supplied user_id
    // Maybe allow for more than one category to be provided in future?
    
    const {limit, offset, user_id} = req.query;
    const {categories} = req.body;

    const query = {
        limit: limit,
        offset: offset,
        where: {
            user_id: user_id,
            ...(categories ? { category_ids: categories } : {}) //...spread provided categories into object if provided
        }
    }

    const transactions = await Transaction.findAll(query);

    return res.status(201).json({
        message: `${transactions.length} of max ${limit} transactions for user_id ${user_id} fetched. Offset: ${offset}`,
        categories: categories ? categories : "not provided",
        transactions
    });
}

async function getTransactionsTotals(req: Request, res:Response){ //Gets totals for credit and debit based on user_id and optional account_id
    const {user_id, account_id} = req.query;
    
    const totalCredit = await Transaction.sum("credit", {
        where: {
            user_id: user_id,
            ...(account_id ? {account_id: account_id} : {})
        }
    });
    const totalDebit = await Transaction.sum("debit", {
        where: {
            user_id: user_id,
            ...(account_id ? {account_id: account_id} : {})
        }
    });

    return res.status(201).json({
        message: `Totals calculated`,
        account_id: account_id ? account_id : "Not provided",
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
    getTransactionsForUserLimited,
    computeTransactionCategories,
    getTransactionsTotals
}