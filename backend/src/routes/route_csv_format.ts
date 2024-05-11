import express from "express";
const controller = require('../controllers/controller_csv_format');

const router = express.Router();

router.post('/format', controller.createFormat);

router.get('/get-formats', controller.getFormats);

router.get("/", (req, res) => {
    res.send("insert csv formats here");
});

router.delete("/delete-csv-format", controller.deleteCSVFormat);

router.patch("/update-csv-format", controller.updateCSVFormat);

module.exports = router;