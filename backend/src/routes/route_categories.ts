import express from "express";
const controller = require('../controllers/controller_category');

const router = express.Router();

router.post('/category', controller.createCategory);

router.get("/", (req, res) => {
    res.send("insert categories here");
});

router.get("/get-categories", controller.getCategories);

router.delete("/delete-category", controller.deleteCategory);

router.patch("/update-category", controller.updateCategory);

module.exports = router;