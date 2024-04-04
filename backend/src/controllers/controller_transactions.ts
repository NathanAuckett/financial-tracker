import {Request, Response} from 'express';
const { sq } = require('../config/db_sequelize');
const { Transaction } = require('../models/');

import {query as queryGetDuplicateTransactions} from '../queries/query_transaction_get_duplicates';


function createTransaction(req: Request, res: Response) {
    Transaction.create(req.body);

    return res.status(201).json({
        message: 'Transactions created successfully'
    });
}

async function getAllTransactions(req: Request, res: Response){
    const users = await Transaction.findAll();
    
    return res.status(201).json({
        message: 'Fetched all transactions successfully',
        users
    });
}

async function getDuplicates(req: Request, res: Response){
    const [results, metadata] = await sq.query(queryGetDuplicateTransactions);

    return res.status(201).json({
        message: 'Duplicates searched and received',
        results
    });
}

module.exports = {
    createTransaction,
    getAllTransactions,
    getDuplicates
}