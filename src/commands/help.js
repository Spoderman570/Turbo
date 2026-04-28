// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all Turbo Customs commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x00b8fd)
      .setAuthor({ name: '🚀 Turbo Customs', iconURL: interaction.guild.iconURL() })
      .setTitle('Command List')
      .addFields(
        {
          name: 'General',
          value: [
            '`/help` — Show this menu',
            '`/ping` — Check bot latency',
            '`/serverinfo` — Server details',
            '`/userinfo [user]` — User profile',
<<<<<<< HEAD
            '`/config` — Bot configuration menu (admin only)',
            '`/giveaway` - Giveaways',
=======
>>>>>>> refs/remotes/origin/main
          ].join('\n'),
        },
        {
          name: 'Design',
          value: [
            '`/robuxtax <amount>` — Calculate Robux after 30% tax',
            '`/quote` — Random design quote',
            '`/review <designer> <rating> <feedback>` — Leave a review',
          ].join('\n'),
        },
        {
          name: 'Moderation',
          value: [
            '`/kick <user> [reason]` — Kick a member',
            '`/ban <user> [reason]` — Ban a member',
            '`/unban <user> [reason]` — Unban a member',
            '`/warn <user> <reason>` — Warn a member',
            '`/warnings <user>` — View warnings',
            '`/clearwarnings <user> <warning-id> [reason]` — Remove a warning and DM the user',
            '`/timeout <user> <minutes> [reason]` — Timeout a member',
            '`/untimeout <user> [reason]` — Remove timeout from a member',
            '`/slowmode <seconds>` — Set channel slowmode',
            '`/purge <amount>` — Bulk delete messages',
          ].join('\n'),
        },
        {
          name: 'Fun',
          value: [
            '`/coinflip` — Flip a coin',
            '`/8ball <question>` — Ask the magic 8-ball',
            '`/roll [sides]` — Roll a dice',
          ].join('\n'),
        },
      )
      .setFooter({ text: 'Turbo Customs • Use /order to get started' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
