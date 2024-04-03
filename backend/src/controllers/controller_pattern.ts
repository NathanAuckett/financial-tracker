import {Request, Response} from 'express';


// Sequelize
const { Pattern } = require('../models/');

function createPattern(req: Request, res: Response) {
    const {user_id, category_id, name, regex_string, match} = req.body;

    Pattern.create({
        user_id: user_id,
        category_id: category_id,
        name: name,
        regex_string: regex_string,
        match: match
    });

    return res.status(201).json({
        message: 'Pattern created successfully',
        pattern: {
            name,
            regex_string,
            match
        }
    });
}

module.exports = {
    createPattern
}