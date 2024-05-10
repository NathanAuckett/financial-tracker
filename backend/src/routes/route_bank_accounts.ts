import express from "express";
const controller = require('../controllers/controller_bank_accounts');

const router = express.Router();

router.post('/bank_account', controller.createBankAccount);

router.get("/", (req, res) => {
    res.send("insert bank accounts here");
});

router.get("/get_bank_accounts", controller.getBankAccounts);

router.delete("/delete_bank_account", controller.deleteBankAccount);

router.patch("/update_bank_account", controller.updateBankAccount);

module.exports = router;