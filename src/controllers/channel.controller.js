const { getAndSaveVoiceChannelsList } = require("../services/channels.service");

async function updateChannels(req, res) {
    let data = req.body['guildId'] ? req.body : JSON.parse(req.body['body']);
    if (!data['guildId']) {
        res.send({ status: 400, message: "Missing keys in JSON request" });
        return;
    }

    let guildId = data['guildId'];
    let updated = await getAndSaveVoiceChannelsList(guildId);

    if (updated) {
        res.send({ status: 200, message: "OK" });
        return;
    }

    res.send({ status: 500, message: "There's a problem retrieving the data" });
}


module.exports = {
    updateChannels,
}