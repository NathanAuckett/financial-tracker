import {Request, Response} from 'express';


// Sequelize
const { Pattern } = require('../models/');

function createPattern(req: Request, res: Response) {
    console.log(req.body);
    Pattern.create(req.body)
    .then(() => {
        return res.status(201).json({
            message: 'Pattern created successfully',
            pattern: req.body
        });
    })
    .catch((error: object[]) => {
        console.log(error);
        return res.status(400).json({
            error
        });
    });
}

async function getPatterns(req:Request, res: Response) {
    const { user_id } = req.query;
    const columns = JSON.parse(req.query.columns as string);
    
    const patterns = await Pattern.findAll({
        attributes: columns ? columns: null
    });
    
    return res.status(201).json({
        message: 'Fetched patterns',
        patterns
    }); 
}

module.exports = {
    createPattern,
    getPatterns
}