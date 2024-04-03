import express from "express";
const controller = require('../controllers/controller_transactions');

const router = express.Router();

router.post('/transaction', controller.createTransaction);

router.get("/", (req, res) => {
    res.send("insert transactions here");
});

module.exports = router;