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
    const columns = req.query.columns ? JSON.parse(req.query.columns as string) : null;
    
    await PatternGroup.findAll({
        where: {
            user_id: user_id
        },
        ...(columns ? {attributes: columns} : {}),
        include: [
            {
                model: Pattern,
                attributes: ["pattern_id", "name", "regex_array", "match_array"]
            }
        ],
    })
    .then((patternGroups:object[]) => {
        return res.status(201).json({
            message: 'Fetched pattern groups for user',
            patternGroups
        }); 
    })
    .catch((error:object[]) => {
        return res.status(400).json({
            error
        }); 
    });

}

module.exports = {
    createPatternGroup,
    getPatternGroups
}