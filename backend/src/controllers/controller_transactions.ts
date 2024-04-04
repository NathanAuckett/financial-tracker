import {Request, Response} from 'express';
const { sq } = require('../config/db_sequelize');

// Sequelize
const { Transaction } = require('../models/');

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
    const [results, metadata] = await sq.query(`
        SELECT account_id, transaction_date, credit, debit, description,
            ROW_NUMBER() OVER ( 
                PARTITION BY account_id, transaction_date, credit, debit, description 
                ORDER BY account_id, transaction_date, credit, debit, description
                ) AS Row_Number
        FROM transaction;`
    );

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