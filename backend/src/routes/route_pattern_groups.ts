import express from "express";
const controller = require('../controllers/controller_pattern_group');

const router = express.Router();

router.post('/pattern_group', controller.createPatternGroup);

router.get("/", (req, res) => {
    res.send("insert pattern groups here");
});

router.get("/get_pattern_groups", controller.getPatternGroups);

module.exports = router;