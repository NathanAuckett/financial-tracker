import {Request, Response} from 'express';
const { sq } = require('../config/db_sequelize');
const { Transaction } = require('../models/');

import {query as queryGetDuplicateTransactions} from '../queries/query_transaction_get_duplicates';


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
    const {limit, offset, user_id} = req.query;

    const transactions = await Transaction.findAll({
        limit: limit,
        offset: offset,
        where: {
            user_id: user_id
        }
    });

    return res.status(201).json({
        message: `${limit} transactions for user fetched`,
        transactions
    });
}

module.exports = {
    addTransaction,
    addBulkTransactions,
    getAllTransactions,
    getDuplicates,
    getTransactions,
    getTransactionsForUserLimited
}