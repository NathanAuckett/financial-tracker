import express from "express";
const controller = require('../controllers/controller_category');

const router = express.Router();

router.post('/category', controller.createCategory);

router.get("/", (req, res) => {
    res.send("insert categories here");
});

router.get("/get_categories", controller.getCategories);

router.delete("/delete_category", controller.deleteCategory);

module.exports = router;