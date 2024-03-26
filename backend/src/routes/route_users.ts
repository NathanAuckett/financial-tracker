import express from "express";
const controller = require('../controllers/controller_users');

const router = express.Router();

router.post('/user', controller.createUser);

router.get("/", (req, res) => {
    res.send("insert users here");
});

module.exports = router;