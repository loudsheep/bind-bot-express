const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');

router.post("/channels", channelController.updateChannels);


module.exports = router;