const dotenv = require('dotenv').config();
const express = require('express');
const Discord = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const channelRoutes = require('./src/routes/channel.routes');
const bindRoutes = require('./src/routes/bind.routes');
const { TimeOutQueue } = require('./src/services/timeoutQueue.service');
const app = express();
const PORT = process.env.PORT ?? 3000;

DiscordClient = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildVoiceStates,
    ]
});

VoiceTimeoutQueue = new TimeOutQueue((guildId) => {
    try {
        const connection = getVoiceConnection(guildId);
        connection.destroy();
    } catch { }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200);
    res.send({ status: "200", message: "ok" });
});

app.use('/', channelRoutes);
app.use('/', bindRoutes);

app.listen(PORT, (error) => {
    if (!error) {
        DiscordClient.login(process.env.DISCORD_BOT_TOKEN);
        console.log("Server is Successfully Running, and App is listening on http://localhost:" + PORT);
    }
    else {
        console.log("Error occurred, server can't start", error);
    }
});