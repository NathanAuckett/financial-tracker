import {Request, Response} from 'express';

const { CSVDictionary } = require('../models/');

function createDictionary(req: Request, res: Response) {
    CSVDictionary.create(req.body);

    return res.status(201).json({
        message: 'CSV Dictionary created successfully'
    });
}

async function getDictionaries(req: Request, res: Response){
    const { user_id } = req.query;
    const columns = req.query.columns ? JSON.parse(req.query.columns as string) : undefined;
    
    await CSVDictionary.findAll({
        ...(columns ? { attributes: columns } : {}),
        where: {
            user_id: user_id
        }
    })
    .then((response: {rowCount: number}[][]) => {
        const [results, metadata] = response;
        
        return res.status(201).json({
            dictionaries: [results]
        });
    })
    .catch((error:Error) => {
        console.log(error);
        return res.status(400).json({
            error: error.message
        });
    });
}
    

module.exports = {
    createDictionary,
    getDictionaries
}