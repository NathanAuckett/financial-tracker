import {Request, Response} from 'express';


// Sequelize
const { Pattern } = require('../models/');

function createPattern(req: Request, res: Response) {
    Pattern.create(req.body);

    return res.status(201).json({
        message: 'Pattern created successfully',
        pattern: req.body
    });
}

module.exports = {
    createPattern
}