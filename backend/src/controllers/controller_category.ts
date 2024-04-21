import {Request, Response} from 'express';


// Sequelize
const { Category } = require('../models/');

function createCategory(req: Request, res: Response) {
    const {user_id, name} = req.body;

    Category.create({
        user_id: user_id,
        name: name
    })
    .then(() => {
        return res.status(201).json({
            message: 'Category created successfully',
            category: {
                user_id,
                name
            }
        });
    })
    .catch((error: object[]) =>{
        console.log(error);

        return res.status(400).json({
            error
        });
    });
}

async function getCategories(req:Request, res: Response) {
    const { user_id } = req.query;
    const columns = JSON.parse(req.query.columns as string);
    
    const categories = await Category.findAll({
        attributes: columns ? columns: null,
        where: {
            user_id: user_id
        }
    });
    
    return res.status(201).json({
        message: 'Fetched categories for user',
        categories
    }); 
}

module.exports = {
    createCategory,
    getCategories
}