// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// In-memory warn store (replace with a DB like sqlite/mongoose for persistence)
const warns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to warn').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for warn').setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (!warns.has(target.id)) warns.set(target.id, []);
    warns.get(target.id).push({ reason, mod: interaction.user.tag, time: Date.now() });
    const count = warns.get(target.id).length;

    const embed = new EmbedBuilder()
      .setColor(0xf9ca24)
      .setTitle('Member Warned')
      .addFields(
        { name: 'User', value: `${target}`, inline: true },
        { name: 'Moderator', value: `${interaction.user}`, inline: true },
        { name: 'Total Warns', value: `${count}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // DM the user
    await target.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xf9ca24)
          .setTitle(`You were warned in ${interaction.guild.name}`)
          .addFields(
            { name: 'Reason', value: reason },
            { name: 'Total Warnings', value: `${count}` },
          )
          .setTimestamp(),
      ],
    }).catch(() => null);
  },

  warns, // export so /warnings can access it
};