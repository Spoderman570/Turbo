// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================
const { SlashCommandBuilder } = require('discord.js');

const REVIEWS_CHANNEL_ID = '1497831959525855362';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('Leave a review for a designer')
    .addUserOption(opt =>
      opt.setName('designer').setDescription('The designer you worked with').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('rating')
        .setDescription('Rating out of 5')
        .setRequired(true)
        .addChoices(
          { name: '⭐ 1', value: 1 },
          { name: '⭐⭐ 2', value: 2 },
          { name: '⭐⭐⭐ 3', value: 3 },
          { name: '⭐⭐⭐⭐ 4', value: 4 },
          { name: '⭐⭐⭐⭐⭐ 5', value: 5 },
        )
    )
    .addStringOption(opt =>
      opt.setName('product').setDescription('What product was made for you?').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('feedback').setDescription('Your review').setRequired(true)
    ),

  async execute(interaction) {
    const designer = interaction.options.getUser('designer');
    const rating   = interaction.options.getInteger('rating');
    const product  = interaction.options.getString('product');
    const feedback = interaction.options.getString('feedback');
    const stars    = '⭐'.repeat(rating) + '✩'.repeat(5 - rating);

    const payload = {
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: [
                `# New Review Submitted`,
                `-# Reviewed by ${interaction.user}!`,
                ``,
                `- **Designer:** ${designer}`,
                `- **Product:** ${product}`,
                `- **Rating:** ${stars}`,
                `- **Feedback:** ${feedback}`,
              ].join('\n'),
            },
          ],
        },
      ],
    };

    await interaction.reply(payload);

    if (interaction.channelId !== REVIEWS_CHANNEL_ID) {
      const reviewsChannel = interaction.guild.channels.cache.get(REVIEWS_CHANNEL_ID);
      if (reviewsChannel) await reviewsChannel.send(payload).catch(() => null);
    }
  },
};
