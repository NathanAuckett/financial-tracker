import express from "express";
const router = express.Router();

const controller = require('../controllers/controller_transactions');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({dest: "../csvUploads"});

router.get("/", (req, res) => {
    res.send("insert transactions here");
});

router.get('/get-all', controller.getAllTransactions);

router.get('/get-duplicates', controller.getDuplicates);

router.get('/get-transactions', controller.getTransactions);

router.get('/get-transactions-for-user-limited', controller.getTransactionsForUserLimited);

router.get('/get-transactions-totals', controller.getTransactionsTotals);

//Post
router.post('/add-transaction', controller.addTransaction);

router.post('/add-bulk-transactions', controller.addBulkTransactions);

router.post('/compute-transaction-categories', controller.computeTransactionCategories);

router.post('/uploadCSV', upload.single("file"), controller.uploadCSV);

module.exports = router;