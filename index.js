const dotenv = require('dotenv').config();
const express = require('express');
const Discord = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const fs = require('node:fs');
const path = require('node:path');
const { Collection, Events, GatewayIntentBits } = require('discord.js');

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

// When client is ready, send signal to process (just for server environment)
DiscordClient.once('ready', () => {
    try {
        process.send('ready');
    } catch { };
});

// bot commands
DiscordClient.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFolders) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        DiscordClient.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

DiscordClient.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// voice connection timeout queue
VoiceTimeoutQueue = new TimeOutQueue((guildId) => {
    try {
        const connection = getVoiceConnection(guildId);
        connection.destroy();
    } catch { }
});


// express routes stuff
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