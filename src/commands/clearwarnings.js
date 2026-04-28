// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const warnCommand = require('./warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear a warning from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member whose warning will be removed').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('warning_id').setDescription('Warning ID to remove').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for warning removal').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warningId = interaction.options.getInteger('warning_id');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const warns = warnCommand.warns;
    const userWarns = warns.get(target.id) || [];

    if (userWarns.length === 0) {
      return interaction.reply({ content: 'That user has no warnings.', ephemeral: true });
    }

    if (warningId < 1 || warningId > userWarns.length) {
      return interaction.reply({ content: `Warning ID must be between 1 and ${userWarns.length}.`, ephemeral: true });
    }

    const removed = userWarns.splice(warningId - 1, 1)[0];
    if (userWarns.length === 0) {
      warns.delete(target.id);
    }

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle('Warning Removed')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Removed Warning ID', value: `${warningId}`, inline: true },
        { name: 'Removed Warning Reason', value: removed.reason },
        { name: 'Clear Reason', value: reason },
        { name: 'Remaining Warnings', value: `${userWarns.length}`, inline: true },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await target.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x9b59b6)
          .setTitle(`A warning was removed in ${interaction.guild.name}`)
          .addFields(
            { name: 'Removed Warning ID', value: `${warningId}`, inline: true },
            { name: 'Removed Warning Reason', value: removed.reason },
            { name: 'Cleared By', value: `${interaction.user.tag}` },
            { name: 'Reason for Removal', value: reason },
            { name: 'Remaining Warnings', value: `${userWarns.length}`, inline: true },
          )
          .setTimestamp(),
      ],
    }).catch(() => null);
  },
};
