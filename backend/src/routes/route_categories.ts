import express from "express";
const controller = require('../controllers/controller_category');

const router = express.Router();

router.post('/category', controller.createCategory);

router.get("/", (req, res) => {
    res.send("insert categories here");
});

module.exports = router;