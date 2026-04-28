// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const warnCommand = require('./warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to check').setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const userWarns = warnCommand.warns.get(target.id) || [];

    const warningLines = userWarns.length === 0
      ? `No warnings on record.`
      : userWarns.map((w, i) =>
          `**Warning #${i + 1}**\n**Reason:** ${w.reason}\n**Mod:** ${w.mod}\n**When:** <t:${Math.floor(w.time / 1000)}:R>`
        ).join('\n\n');

    await interaction.reply({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: `# Warnings — ${target.username}`,
            },
            {
              type: 14,
            },
            {
              type: 10,
              content: warningLines,
            },
            {
              type: 14,
            },
            {
              type: 10,
              content: `-# ${userWarns.length} total warning(s)`,
            },
          ],
        },
      ],
    });
  },
};
