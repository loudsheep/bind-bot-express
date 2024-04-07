const { query } = require("./db.service");

async function getAndSaveVoiceChannelsList(guildId) {
    try {
        let guild = await DiscordClient.guilds.fetch(guildId);
        let channels = await guild.channels.fetch();
        channels = channels.filter(c => c.type == "2");

        let selectedChannel = (await query("SELECT selected_voice_channel FROM guilds WHERE guildID = ?", [guildId]))[0]['selected_voice_channel'];
        let channelExists = false;

        let channelData = [];
        channels.map((value, key) => {
            if (key == selectedChannel) channelExists = true;
            channelData.push({
                channelId: key,
                name: value['name'],
            });
        });

        if (!channelExists) selectedChannel = null;

        await query("UPDATE guilds SET voice_channels = ?, selected_voice_channel = ? WHERE guildId = ?", [JSON.stringify(channelData), selectedChannel, guildId]);
        return true
    } catch { };

    return false;
}


module.exports = {
    getAndSaveVoiceChannelsList,
}