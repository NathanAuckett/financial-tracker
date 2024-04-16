import express from "express";
const controller = require('../controllers/controller_pattern');

const router = express.Router();

router.post('/pattern', controller.createPattern);

router.get("/", (req, res) => {
    res.send("insert patterns here");
});

router.get("/get_patterns", controller.getPatterns);

module.exports = router;