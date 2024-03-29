const { query } = require("./db.service");

async function getAndSaveVoiceChannelsList(guildId) {
    try {
        let guild = await DiscordClient.guilds.fetch(guildId);
        let channels = await guild.channels.fetch();
        channels = channels.filter(c => c.type == "2");

        let channelData = [];
        channels.map((value, key) => {
            channelData.push({
                channelId: key,
                name: value['name'],
            });
        })

        await query("UPDATE guilds SET voice_channels = ? WHERE guildId = ?", [JSON.stringify(channelData), guildId]);
        return true
    } catch { };
    
    return false;
}


module.exports = {
    getAndSaveVoiceChannelsList,
}