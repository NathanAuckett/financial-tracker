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

module.exports = {
    addTransaction,
    addBulkTransactions,
    getAllTransactions,
    getDuplicates
}