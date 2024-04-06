import express from "express";
const controller = require('../controllers/controller_transactions');

const router = express.Router();

router.get("/", (req, res) => {
    res.send("insert transactions here");
});

router.get('/get-all', controller.getAllTransactions);

router.get('/get-duplicates', controller.getDuplicates);

router.get('/get-transactions', controller.getTransactions);

router.get('/get-transactions-for-user-limited', controller.getTransactionsForUserLimited);

//Post
router.post('/add-transaction', controller.addTransaction);

router.post('/add-bulk-transactions', controller.addBulkTransactions);

module.exports = router;