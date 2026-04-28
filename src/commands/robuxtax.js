// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================
const { SlashCommandBuilder } = require('discord.js');

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
    const desired   = interaction.options.getInteger('amount');
    const listPrice = Math.ceil(desired / (1 - TAX_RATE));
    const taxCut    = listPrice - desired;
    const ratio     = ((taxCut / listPrice) * 100).toFixed(1);

    await interaction.reply({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: [
                `# Robux Tax Calculator`,
                ``,
                `Roblox takes **30%** of every marketplace sale.`,
                ``,
                `**You want to receive:** ${desired.toLocaleString()} R$`,
                `**List price at:** ${listPrice.toLocaleString()} R$`,
                `**Roblox takes:** ${taxCut.toLocaleString()} R$ (${ratio}%)`,
                `**You keep:** ${desired.toLocaleString()} R$`,
              ].join('\n'),
            },
            {
              type: 14,
            },
            {
              type: 10,
              content: `-# Based on Roblox's standard 30% marketplace fee`,
            },
          ],
        },
      ],
    });
  },
};
