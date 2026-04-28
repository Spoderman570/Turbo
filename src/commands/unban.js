// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a member from the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to unban').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for unban').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) {
      return interaction.reply({ content: 'Could not find that user.', ephemeral: true });
    }

    try {
      const ban = await interaction.guild.bans.fetch(target.id);
      if (!ban) {
        return interaction.reply({ content: 'That user is not banned.', ephemeral: true });
      }
    } catch (error) {
      return interaction.reply({ content: 'That user is not banned.', ephemeral: true });
    }

    await interaction.guild.bans.remove(target, reason);

    const embed = new EmbedBuilder()
      .setColor(0x2ed573)
      .setTitle('Member Unbanned')
      .addFields(
        { name: 'User', value: `${target.tag}`, inline: true },
        { name: 'Moderator', value: `${interaction.user.tag}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
