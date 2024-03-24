const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');

router.get("/channels/:guildId", channelController.listVoiceChannels);


module.exports = router;