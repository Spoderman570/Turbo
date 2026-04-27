// commands/giveaway.js
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Start a giveaway in this channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Duration in minutes')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('prize')
        .setDescription('What is being given away?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const durationMinutes = interaction.options.getInteger('duration');
    const prize = interaction.options.getString('prize');

    const durationMs = durationMinutes * 60 * 1000;
    const endTimestamp = Date.now() + durationMs;

    const giveawayEmbed = {
      title: '🎉 Giveaway Started!',
      description: [
        `**Prize:** ${prize}`,
        `**Host:** ${interaction.user}`,
        '',
        `React with 🎉 to enter!`,
        `Ends <t:${Math.floor(endTimestamp / 1000)}:R>`,
      ].join('\n'),
      color: 0x5865f2,
    };

    const message = await interaction.reply({
      embeds: [giveawayEmbed],
      fetchReply: true,
    });

    await message.react('🎉');

    setTimeout(async () => {
      // Fetch fresh message to get updated reactions
      const fetched = await message.fetch().catch(() => null);
      if (!fetched) return;

      const reaction = fetched.reactions.cache.get('🎉');
      if (!reaction) {
        await interaction.followUp('No one reacted to the giveaway.');
        return;
      }

      const users = await reaction.users.fetch();
      const validUsers = users.filter(u => !u.bot);

      if (!validUsers.size) {
        await interaction.followUp('No valid entries for the giveaway.');
        return;
      }

      const winner = validUsers.random();

      const endedEmbed = {
        title: '🎉 Giveaway Ended!',
        description: [
          `**Prize:** ${prize}`,
          `**Host:** ${interaction.user}`,
          '',
          `Winner: ${winner}`,
        ].join('\n'),
        color: 0x2ecc71,
      };

      await fetched.edit({ embeds: [endedEmbed] }).catch(() => null);
      await interaction.followUp(`🎉 Congratulations ${winner}! You won **${prize}**.`);
    }, durationMs);
  },
};
