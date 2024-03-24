const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');

const userCount = async (guildId, channelId) => {
    try {
        let guild = DiscordClient.guilds.cache.get(guildId);
        let voiceChannel = await guild.channels.fetch(channelId, { force: true });

        return voiceChannel.members?.size;
    } catch {
        return 0
    }
};


const playSoundInVoiceChannel = async (guildId, channelId, resourceUrl) => {
    if (process.env.ALLOW_JOIN_EMPTY_CHANNELS != "true" && await userCount(guildId, channelId) <= 0) {
        return "No users connected to voice channel. No sound will be played.";
    }

    let guild = await DiscordClient.guilds.cache.get(guildId);
    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guildId,
        selfDeaf: true,
        selfMute: false,
        adapterCreator: guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    const resource = createAudioResource(resourceUrl);

    VoiceTimeoutQueue.addToQueue(guildId, resource.playbackDuration);

    player.play(resource);
    connection.subscribe(player);

    return "Sound played successfuly";
};


module.exports = {
    playSoundInVoiceChannel,
}