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

async function deletePatternGroup(req:Request, res: Response){
    const { user_id, pattern_group_id } = req.query;

    if (!user_id || !pattern_group_id){
        return res.status(400).json({
            message: 'Delete failed! Missing user_id or pattern_group_id from request.',
            query: req.query
        }); 
    }

    await PatternGroup.destroy({
        where: {
            user_id: user_id,
            pattern_group_id: pattern_group_id
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

async function updatePatternGroup(req:Request, res: Response) {
    const { user_id, pattern_group_id} = req.body;

    //spread body into new obj and remove identifiers
    const updateValues = {...req.body}
    delete updateValues.user_id;
    delete updateValues.pattern_group_id;

    if (!user_id || !pattern_group_id || !Object.keys(updateValues).length){
        return res.status(400).json({
            message: 'Update failed! Missing user_id, pattern_group_id, or no update data provided.',
            query: req.body
        }); 
    }

    await PatternGroup.update(updateValues,
        {
            where: {
                user_id: user_id,
                pattern_group_id: pattern_group_id
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
    createPatternGroup,
    getPatternGroups,
    deletePatternGroup,
    updatePatternGroup
}