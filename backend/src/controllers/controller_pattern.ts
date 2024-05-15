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

async function deletePattern(req:Request, res: Response){
    const { pattern_id } = req.query;

    if (!pattern_id){
        return res.status(400).json({
            message: 'Delete failed! Missing pattern_id from request.',
            query: req.query
        }); 
    }

    await Pattern.destroy({
        where: {
            pattern_id: pattern_id
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

async function updatePattern(req:Request, res: Response) {
    const { user_id, pattern_id} = req.body;

    //spread body into new obj and remove identifiers
    const updateValues = {...req.body}
    delete updateValues.user_id;
    delete updateValues.pattern_id;

    if (!user_id || !pattern_id || !Object.keys(updateValues).length){
        return res.status(400).json({
            message: 'Update failed! Missing user_id, pattern_id, or no update data provided.',
            query: req.body
        }); 
    }

    await Pattern.update(updateValues,
        {
            where: {
                user_id: user_id,
                pattern_id: pattern_id
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
    createPattern,
    getPatterns,
    deletePattern,
    updatePattern
}