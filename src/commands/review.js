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
      opt.setName('feedback').setDescription('Your review').setRequired(true)
    ),

  async execute(interaction) {
    const designer = interaction.options.getUser('designer');
    const rating   = interaction.options.getInteger('rating');
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
                `# New Review`,
                ``,
                `**Designer:** ${designer}`,
                `**Client:** ${interaction.user}`,
                `**Rating:** ${stars}`,
                `**Review:** ${feedback}`,
              ].join('\n'),
            },
            {
              type: 14,
            },
            {
              type: 10,
              content: `-# Reviewed by ${interaction.user.tag}`,
            },
          ],
        },
      ],
    };

    await interaction.reply(payload);

    // Post to reviews channel if not already there
    if (interaction.channelId !== REVIEWS_CHANNEL_ID) {
      const reviewsChannel = interaction.guild.channels.cache.get(REVIEWS_CHANNEL_ID);
      if (reviewsChannel) await reviewsChannel.send(payload).catch(() => null);
    }
  },
};
