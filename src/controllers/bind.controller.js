const { playSoundInVoiceChannel } = require("../services/voiceChannelPlayer.service");

async function playBind(req, res) {
    let data = req.body;

    if (!data['url'] || !data['guildId'] || !data['channelId']) {
        res.send({ status: 400, message: "Missing keys in JSON request" });
        return;
    }

    try {
        let result = await playSoundInVoiceChannel(data['guildId'], data['channelId'], data['url']);
        res.send({ status: 200, message: result });
    } catch (e) {
        console.log(e);
        res.send({ status: 500, message: "Exception while playing a sound" });
        return;
    }
}


module.exports = {
    playBind,
}