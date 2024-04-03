import {Request, Response} from 'express';


// Sequelize
const { Category } = require('../models/');

function createCategory(req: Request, res: Response) {
    const {name} = req.body;

    Category.create({
        name: name,
    });

    return res.status(201).json({
        message: 'Category created successfully',
        category: {
            name
        }
    });
}

module.exports = {
    createCategory
}