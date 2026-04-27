// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{
        name: process.env.STATUS || '🚀 Turbo Customs | /help',
        type: ActivityType.Watching,
      }],
      status: 'online',
    });
  },
};