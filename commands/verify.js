const { SlashCommandBuilder } = require('discord.js');
const { query } = require('../src/services/db.service');
const { getAndSaveVoiceChannelsList } = require('../src/services/channels.service');

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verifies server to play binds directly in voice channel.')
        .addStringOption(option =>
            option
                .setName('code')
                .setDescription('Verification code optained on Binder website.')
                .setRequired(true)
        ),
    async execute(interaction) {
        const code = interaction.options.getString('code');

        let guild = await query("SELECT * FROM guilds WHERE verification_code = ?", [code]);

        if (guild.length != 1) {
            await interaction.reply("There was a problem verifying your server. Is the **code** correct?");
            return;
        }
        guild = guild[0];

        let res = await query("UPDATE guilds SET guildId = ?, verified = 1 WHERE id = ?;", [interaction.guildId, guild['id']]);
        if (res['affectedRows'] == 1) {
            await interaction.reply("Your server as been verified, you may soon use your bind in voice channels.");
        } else {
            await interaction.reply("There was a problem verifying your server. Is the **code** correct?");
        }

        getAndSaveVoiceChannelsList(interaction.guildId);
    },
};