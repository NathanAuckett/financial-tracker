import {Request, Response} from 'express';


// Sequelize
const { Transaction } = require('../models/');

function createTransaction(req: Request, res: Response) {
    Transaction.create(req.body);

    return res.status(201).json({
        message: 'Transactions created successfully'
    });
}

module.exports = {
    createTransaction
}