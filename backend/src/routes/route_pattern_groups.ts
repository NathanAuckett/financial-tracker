import express from "express";
const controller = require('../controllers/controller_pattern_group');

const router = express.Router();

router.post('/pattern-group', controller.createPatternGroup);

router.get("/", (req, res) => {
    res.send("insert pattern groups here");
});

router.get("/get-pattern-groups", controller.getPatternGroups);

module.exports = router;