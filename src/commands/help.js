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
            '`/config` — Bot configuration menu (admin only)',
            '`/giveaway` - Giveaways',
          ].join('\n'),
        },
        {
          name: 'Design',
          value: [
            '`/order` — Submit a design order',
            '`/pricing` — View service pricing',
            '`/robuxtax <amount>` — Calculate Robux after 30% tax',
            '`/quote` — Random design quote',
            '`/review <designer> <rating> <feedback>` — Leave a review',
            '`/claim <order_id> [eta]` — Claim an open order',
          ].join('\n'),
        },
        {
          name: 'Moderation',
          value: [
            '`/kick <user> [reason]` — Kick a member',
            '`/ban <user> [reason]` — Ban a member',
            '`/warn <user> <reason>` — Warn a member',
            '`/warnings <user>` — View warnings',
            '`/timeout <user> <minutes>` — Timeout a member',
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