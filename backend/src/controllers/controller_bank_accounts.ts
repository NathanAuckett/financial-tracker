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
    const columns = JSON.parse(req.query.columns as string);
    
    const accounts = await BankAccount.findAll({
        attributes: columns ? columns: null,
        where: {
            user_id: user_id
        }
    });
    
    return res.status(201).json({
        message: 'Fetched bank accounts for user',
        accounts
    }); 
}

async function deleteBankAccount(req:Request, res: Response){
    const { user_id, bank_account_id } = req.query;

    if (!user_id || !bank_account_id){
        return res.status(400).json({
            message: 'Delete failed! Missing user_id or bank_account_id from request.',
            query: req.query
        }); 
    }

    await BankAccount.destroy({
        where: {
            user_id: user_id,
            bank_account_id: bank_account_id
        }
    })
    .then((response:object[]) => {
        return res.status(201).json({
            message: "Delete successful!",
            response
        }); 
    })
    .catch((error:Error) => {
        return res.status(400).json({
            error: error.message
        }); 
    });
}

async function updateBankAccount(req:Request, res: Response) {
    const { user_id, bank_account_id} = req.body;

    //spread body into new obj and remove identifiers
    const updateValues = {...req.body}
    delete updateValues.user_id;
    delete updateValues.bank_account_id;

    if (!user_id || !bank_account_id || !Object.keys(updateValues).length){
        return res.status(400).json({
            message: 'Update failed! Missing user_id, bank_account_id, or no update data provided.',
            query: req.body
        }); 
    }

    await BankAccount.update(updateValues,
        {
            where: {
                user_id: user_id,
                bank_account_id: bank_account_id
            }
        }
    )
    .then((response:object[]) => {
        return res.status(201).json({
            message: "Update successful!",
            response
        }); 
    })
    .catch((error:Error) => {
        return res.status(400).json({
            error: error.message
        }); 
    });
}

module.exports = {
    createBankAccount,
    getBankAccounts,
    deleteBankAccount,
    updateBankAccount
}