// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to timeout').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('minutes').setDescription('Duration in minutes (max 40320 / 28 days)').setMinValue(1).setMaxValue(40320).setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for timeout').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const minutes = interaction.options.getInteger('minutes');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: 'Could not find that member.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: 'I cannot timeout that member.', ephemeral: true });

    await target.timeout(minutes * 60 * 1000, reason);

    const until = Math.floor((Date.now() + minutes * 60 * 1000) / 1000);

    const embed = new EmbedBuilder()
      .setColor(0xff6b6b)
      .setTitle('Member Timed Out')
      .addFields(
        { name: 'User', value: `${target.user}`, inline: true },
        { name: 'Moderator', value: `${interaction.user}`, inline: true },
        { name: 'Duration', value: `${minutes} min`, inline: true },
        { name: 'Expires', value: `<t:${until}:R>`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};