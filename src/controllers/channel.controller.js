async function listVoiceChannels(req, res) {
    let guildId = req.params.guildId;

    try {
        let guild = await DiscordClient.guilds.fetch(guildId);
        let channels = await guild.channels.fetch();
        channels = channels.filter(c => c.type == "2");

        res.send({ status: 200, message: "Voice channels", data: channels });
    } catch {
        res.send({ status: 403, message: "There's a problem retrieving the data" });
    };
}


module.exports = {
    listVoiceChannels,
}