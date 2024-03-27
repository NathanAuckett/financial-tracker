import {Request, Response} from 'express';


// Sequelize
const { User } = require('../models/');
function createUser(req: Request, res: Response) {
    const {name, email, password} = req.body;

    User.create({
        name: name,
        email: email,
        password: password
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
    createUser
}