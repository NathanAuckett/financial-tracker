import {Request, Response} from 'express';

const { CSVDictionary } = require('../models/');

function createDictionary(req: Request, res: Response) {
    CSVDictionary.create(req.body);

    return res.status(201).json({
        message: 'CSV Dictionary created successfully'
    });
}

async function getAllDictionaries(req: Request, res: Response){
    const dictionaries = await CSVDictionary.findAll();
    
    return res.status(201).json({
        message: 'Fetched all dictionaries successfully',
        dictionaries
    });
}

module.exports = {
    createDictionary,
    getAllDictionaries
}