import {Request, Response} from 'express';

const { User } = require('../models/');

function createUser(req: Request, res: Response) {
    User.create(req.body);

    return res.status(201).json({
        message: 'User created successfully'
    });
}

async function getAllUsers(req: Request, res: Response){
    const users = await User.findAll();
    
    return res.status(201).json({
        message: 'Fetched all users successfully',
        users
    });
}

module.exports = {
    createUser,
    getAllUsers
}