import {Request, Response} from 'express';


// Sequelize
const { Transaction } = require('../models/');

function createTransaction(req: Request, res: Response) {
    const {name, email, password} = req.body;

    Transaction.create({
        name: name,
        email: email,
        password: password
    });
}

module.exports = {
    createTransaction
}