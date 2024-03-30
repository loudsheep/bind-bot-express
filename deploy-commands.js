const dotenv = require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolder = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));
for (const file of commandFolder) {
    const filePath = path.join(foldersPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        let data = null;
        // The put method is used to fully refresh all commands in the guild/globally with the current set
        if (process.env.DEPLOY_GLOBALLY == "true") {
            data = await rest.put(
                Routes.applicationCommands(process.env.DEPLOY_CLIENT_ID),
                { body: commands },
            );
        } else {
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.DEPLOY_CLIENT_ID, process.env.DEPLOY_GUILD_ID),
                { body: commands },
            );
        }

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();