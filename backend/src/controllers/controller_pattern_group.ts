import {Request, Response} from 'express';


const { PatternGroup, Pattern } = require('../models/');

function createPatternGroup(req: Request, res: Response) {
    console.log(req.body);

    PatternGroup.create(req.body)
    .then(() => {
        return res.status(201).json({
            message: 'Pattern Group created successfully',
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

async function getPatternGroups(req:Request, res: Response) {
    const { user_id } = req.query;
    
    const patternGroups = await PatternGroup.findAll({
        where: {
            user_id: user_id
        },
        include: [
            {
                model: Pattern
            }
        ],
    });

    return res.status(201).json({
        message: 'Fetched pattern groups for user',
        patternGroups
    }); 
}

module.exports = {
    createPatternGroup,
    getPatternGroups
}