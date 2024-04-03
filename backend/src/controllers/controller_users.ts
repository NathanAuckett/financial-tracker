import {Request, Response} from 'express';


// Sequelize
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

//Pool
//import {pool} from '../config/db_pgPool';
// async function createUser(req: Request, res: Response): Promise<Response> {
//     const {name, email, password} = req.body;

//     await pool.query(`INSERT INTO "user" ("name", "email", "password") VALUES ('${name}', '${email}', '${password}')`);

//     return res.status(201).json({
//         message: 'User created successfully',
//         user: {
//             name,
//             email
//         }
//     });
// }

// function createUser(req: Request, res: Response){
//     res.send("Create a new user!");
// }


module.exports = {
    createUser,
    getAllUsers
}