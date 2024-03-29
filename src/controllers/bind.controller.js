const { playSoundInVoiceChannel } = require("../services/voiceChannelPlayer.service");

async function playBind(req, res) {
    let data = req.body['guildId'] ? req.body : JSON.parse(req.body['body']);

    if (!data['url'] || !data['guildId'] || !data['channelId']) {
        res.send({ status: 400, message: "Missing keys in JSON request" });
        return;
    }

    try {
        let result = await playSoundInVoiceChannel(data['guildId'], data['channelId'], data['url']);
        res.send({ status: result[0], message: result[1] });
    } catch (e) {
        console.log(e);
        res.send({ status: 500, message: "Exception while playing a sound" });
        return;
    }
}


module.exports = {
    playBind,
}