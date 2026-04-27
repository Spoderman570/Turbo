// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a dice')
    .addIntegerOption(opt =>
      opt.setName('sides').setDescription('Number of sides (default: 6)').setMinValue(2).setMaxValue(1000).setRequired(false)
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor(0x00b8fd)
      .setDescription(`🎲 Rolled a **d${sides}** — you got **${result}**!`)
      .setFooter({ text: `Rolled by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};