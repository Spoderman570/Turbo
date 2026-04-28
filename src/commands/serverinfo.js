// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Display server information'),

  async execute(interaction) {
    const { guild } = interaction;
    await guild.members.fetch();

    const createdTimestamp = Math.floor(guild.createdTimestamp / 1000);

    await interaction.reply({
      flags: 32768,
      components: [
        {
          type: 17, 
          components: [
        
            {
              type: 10, 
            content: `# ${guild.name}`,
            },

            ...(guild.iconURL()
              ? [
                  {
                    type: 11, 
                    media: { url: guild.iconURL({ size: 256 }) },
                  },
                ]
              : []),
    
            {
              type: 14, 
            },
        
            {
              type: 10,
              content: [
                `**Owner:** <@${guild.ownerId}>`,
                `**Members:** ${guild.memberCount}`,
                `**Channels:** ${guild.channels.cache.size}`,
                `**Roles:** ${guild.roles.cache.size}`,
                `**Boosts:** ${guild.premiumSubscriptionCount || 0}`,
                `**Created:** <t:${createdTimestamp}:D>`,
                `**ID:** ${guild.id}`,
              ].join('\n'),
            },
          ],
        },
      ],
    });
  },
};
