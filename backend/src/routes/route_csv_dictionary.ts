import express from "express";
const controller = require('../controllers/controller_csv_dictionary');

const router = express.Router();

router.post('/dictionary', controller.createDictionary);

router.get('/get-dictionaries', controller.getDictionaries);

router.get("/", (req, res) => {
    res.send("insert csv dictionaries here");
});

module.exports = router;