// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Remove timeout from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to remove timeout from').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for untimeout').setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!target) return interaction.reply({ content: 'Could not find that member.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: 'I cannot modify that member.', ephemeral: true });

    const isTimedOut = target.isCommunicationDisabled ? target.isCommunicationDisabled() : Boolean(target.communicationDisabledUntilTimestamp);
    if (!isTimedOut) return interaction.reply({ content: 'That member is not currently timed out.', ephemeral: true });

    await target.timeout(null, reason);

    const embed = new EmbedBuilder()
      .setColor(0x1dd1a1)
      .setTitle('Member Untimed Out')
      .addFields(
        { name: 'User', value: `${target.user}`, inline: true },
        { name: 'Moderator', value: `${interaction.user}`, inline: true },
        { name: 'Reason', value: reason },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    await target.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x1dd1a1)
          .setTitle(`Your timeout was removed in ${interaction.guild.name}`)
          .addFields(
            { name: 'Moderator', value: `${interaction.user.tag}` },
            { name: 'Reason', value: reason },
          )
          .setTimestamp(),
      ],
    }).catch(() => null);
  },
};
