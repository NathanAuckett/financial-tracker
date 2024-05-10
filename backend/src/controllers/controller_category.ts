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

async function deleteCategory(req:Request, res: Response){
    const { user_id, category_id } = req.query;

    if (!user_id || !category_id){
        return res.status(400).json({
            message: 'Delete failed! Missing user_id or category_id from request.',
            query: req.query
        }); 
    }

    await Category.destroy({
        where: {
            user_id: user_id,
            category_id: category_id
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

async function updateCategory(req:Request, res: Response) {
    const { user_id, category_id, name } = req.body;

    if (!user_id || !category_id || !name){
        return res.status(400).json({
            message: 'Update failed! Missing user_id or category_id from request.',
            query: req.query
        }); 
    }

    await Category.update({ name: name },
        {
            where: {
                user_id: user_id,
                category_id: category_id
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
    createCategory,
    getCategories,
    deleteCategory,
    updateCategory
}