// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Roblox takes 30% on marketplace sales
const TAX_RATE = 0.30;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('robuxtax')
    .setDescription('Calculate Robux after marketplace tax')
    .addIntegerOption(opt =>
      opt
        .setName('amount')
        .setDescription('Amount you want to RECEIVE after tax')
        .setMinValue(1)
        .setRequired(true)
    ),

  async execute(interaction) {
    const desired = interaction.options.getInteger('amount');

    // To receive X robux, you need to list at X / 0.70
    const listPrice = Math.ceil(desired / (1 - TAX_RATE));
    const taxCut    = listPrice - desired;
    const ratio     = ((taxCut / listPrice) * 100).toFixed(1);

    const embed = new EmbedBuilder()
      .setColor(0x00b8fd)
      .setAuthor({ name: '🚀 Turbo Customs — Robux Tax Calculator' })
      .setDescription(`Roblox takes **30%** of every marketplace sale.`)
      .addFields(
        {
          name: 'You want to receive',
          value: `**${desired.toLocaleString()} R$**`,
          inline: true,
        },
        {
          name: 'List price at',
          value: `**${listPrice.toLocaleString()} R$**`,
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true,
        },
        {
          name: 'Roblox takes',
          value: `**${taxCut.toLocaleString()} R$** (${ratio}%)`,
          inline: true,
        },
        {
          name: 'You keep',
          value: `**${desired.toLocaleString()} R$**`,
          inline: true,
        },
      )
      .setFooter({ text: 'Based on Roblox\'s standard 30% marketplace fee' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};