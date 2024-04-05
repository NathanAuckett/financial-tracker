import express from "express";
const controller = require('../controllers/controller_transactions');

const router = express.Router();

router.post('/add-transaction', controller.addTransaction);

router.post('/add-bulk-transactions', controller.addBulkTransactions);

router.get("/", (req, res) => {
    res.send("insert transactions here");
});

router.get('/get-all', controller.getAllTransactions);

router.get('/get-duplicates', controller.getDuplicates);

module.exports = router;