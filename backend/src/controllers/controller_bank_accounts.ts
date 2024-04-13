import {Request, Response} from 'express';


// Sequelize
const { BankAccount } = require('../models/');

function createBankAccount(req: Request, res: Response) {
    const {user_id, account_number, name} = req.body;

    BankAccount.create({
        user_id: user_id,
        account_number: account_number,
        name: name
    });

    return res.status(201).json({
        message: 'Bank Account created successfully',
        bank_account: {
            account_number,
            name
        }
    });
}

async function getBankAccounts(req:Request, res: Response) {
    const { user_id } = req.query;
    
    const accounts = await BankAccount.findAll({
        where: {
            user_id: user_id
        }
    });
    
    return res.status(201).json({
        message: 'Fetched bank accounts for user',
        accounts
    }); 
}

module.exports = {
    createBankAccount,
    getBankAccounts
}