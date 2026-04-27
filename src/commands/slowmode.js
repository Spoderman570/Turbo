// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set slowmode in the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(opt =>
      opt.setName('seconds').setDescription('Slowmode in seconds (0 to disable, max 21600)').setMinValue(0).setMaxValue(21600).setRequired(true)
    ),

  async execute(interaction) {
    const seconds = interaction.options.getInteger('seconds');
    await interaction.channel.setRateLimitPerUser(seconds);

    const embed = new EmbedBuilder()
      .setColor(0x00b8fd)
      .setDescription(
        seconds === 0
          ? `🟢 Slowmode disabled in ${interaction.channel}.`
          : `🐢 Slowmode set to **${seconds}s** in ${interaction.channel}.`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};