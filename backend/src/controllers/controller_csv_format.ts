import {Request, Response} from 'express';

const { CSVFormat } = require('../models/');

function createFormat(req: Request, res: Response) {
    CSVFormat.create(req.body);

    return res.status(201).json({
        message: 'CSV Format created successfully'
    });
}

async function getFormats(req: Request, res: Response){
    const { user_id } = req.query;
    const columns = req.query.columns ? JSON.parse(req.query.columns as string) : undefined;
    
    await CSVFormat.findAll({
        ...(columns ? { attributes: columns } : {}),
        where: {
            user_id: user_id
        }
    })
    .then((response: {rowCount: number}[][]) => {
        return res.status(201).json({
            formats: response
        });
    })
    .catch((error:Error) => {
        console.log(error);
        return res.status(400).json({
            error: error.message
        });
    });
}
    
async function deleteCSVFormat(req:Request, res: Response){
    const { user_id, csv_format_id } = req.query;

    if (!user_id || !csv_format_id){
        return res.status(400).json({
            message: 'Delete failed! Missing user_id or csv_format_id from request.',
            query: req.query
        }); 
    }

    await CSVFormat.destroy({
        where: {
            user_id: user_id,
            csv_format_id: csv_format_id
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

async function updateCSVFormat(req:Request, res: Response) {
    const { user_id, csv_format_id} = req.body;

    //spread body into new obj and remove identifiers
    const updateValues = {...req.body}
    delete updateValues.user_id;
    delete updateValues.csv_format_id;

    if (!user_id || !csv_format_id || !Object.keys(updateValues).length){
        return res.status(400).json({
            message: 'Update failed! Missing user_id, csv_format_id, or no update data provided.',
            query: req.body
        }); 
    }

    await CSVFormat.update(updateValues,
        {
            where: {
                user_id: user_id,
                csv_format_id: csv_format_id
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
    createFormat,
    getFormats,
    deleteCSVFormat,
    updateCSVFormat
}