// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { ActivityType, REST, Routes } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{
        name: process.env.STATUS || '🚀 Turbo Customs | /help',
        type: ActivityType.Watching,
      }],
      status: 'online',
    });

    const token = process.env.DISCORD_TOKEN;
    const clientId = process.env.CLIENT_ID;
    if (!token || !clientId) {
      console.log('Skipping command registration: missing DISCORD_TOKEN or CLIENT_ID.');
      return;
    }

    const commands = client.commands.map(command => command.data?.toJSON()).filter(Boolean);
    if (!commands.length) {
      console.log('No commands found to register.');
      return;
    }

    console.log(`Found ${client.commands.size} commands in collection, deploying ${commands.length} valid commands`);
    console.log('Commands to deploy:', commands.map(c => c.name).join(', '));

    const rest = new REST({ version: '10' }).setToken(token);
    const guildId = process.env.GUILD_ID;
    const route = guildId
      ? Routes.applicationGuildCommands(clientId, guildId)
      : Routes.applicationCommands(clientId);

    try {
      const target = guildId ? `guild ${guildId}` : 'global application commands';
      console.log(`Deploying ${commands.length} commands to ${target}...`);
      await rest.put(route, { body: commands });
      console.log(`✅ Commands registered to ${target}`);
    } catch (error) {
      console.error('Failed to register commands:', error);
    }
  },
};