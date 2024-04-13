import express from "express";
const controller = require('../controllers/controller_bank_accounts');

const router = express.Router();

router.post('/bank_account', controller.createBankAccount);

router.get("/", (req, res) => {
    res.send("insert bank accounts here");
});

router.get("/get_bank_accounts", controller.getBankAccounts);

module.exports = router;