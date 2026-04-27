// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
    const rating = interaction.options.getInteger('rating');
    const feedback = interaction.options.getString('feedback');
    const stars = '⭐'.repeat(rating) + '✩'.repeat(5 - rating);

    const embed = new EmbedBuilder()
      .setColor(rating >= 4 ? 0x2ed573 : rating === 3 ? 0xf9ca24 : 0xff4757)
      .setAuthor({ name: '🚀 Turbo Customs — New Review' })
      .addFields(
        { name: 'Designer', value: `${designer}`, inline: true },
        { name: 'Client', value: `${interaction.user}`, inline: true },
        { name: 'Rating', value: stars, inline: true },
        { name: 'Review', value: feedback },
      )
      .setFooter({ text: `Reviewed by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });

    // Also post to a #reviews channel if it exists
    const reviewsChannel = interaction.guild.channels.cache.find(c => c.name === 'reviews');
    if (reviewsChannel && reviewsChannel.id !== interaction.channelId) {
      await reviewsChannel.send({ embeds: [embed] });
    }
  },
};