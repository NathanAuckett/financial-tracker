import express from "express";
const controller = require('../controllers/controller_bank_accounts');

const router = express.Router();

router.post('/bank_account', controller.createBankAccount);

router.get("/", (req, res) => {
    res.send("insert bank accounts here");
});

router.get("/get-bank-accounts", controller.getBankAccounts);

router.delete("/delete-bank-account", controller.deleteBankAccount);

router.patch("/update-bank-account", controller.updateBankAccount);

module.exports = router;