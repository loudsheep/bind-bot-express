const express = require('express');
const router = express.Router();
const bindController = require('../controllers/bind.controller');

// TODO change to .post()
router.get("/play", bindController.playBind);
router.post("/play", bindController.playBind);


module.exports = router;