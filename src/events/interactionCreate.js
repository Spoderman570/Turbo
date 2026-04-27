// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { EmbedBuilder } = require('discord.js');

const CONFIG_IDS = [
  'config_section',
  'config_ch_orders', 'config_ch_reviews', 'config_ch_logs', 'config_ch_welcome',
  'config_role_mod', 'config_role_designer', 'config_role_auto',
  'config_back', 'config_toggle_welcome',
];

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // ── Route config menu components ─────────────────────────────────────────
    const isConfigComponent =
      (interaction.isStringSelectMenu() || interaction.isChannelSelectMenu() ||
       interaction.isRoleSelectMenu() || interaction.isButton()) &&
      CONFIG_IDS.includes(interaction.customId);

    if (isConfigComponent) {
      const configCommand = client.commands.get('config');
      if (configCommand) {
        return configCommand.handleComponent(interaction).catch(console.error);
      }
    }

    // ── Slash commands ────────────────────────────────────────────────────────
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`Error in /${interaction.commandName}:`, err);

      const errEmbed = new EmbedBuilder()
        .setColor(0xff4757)
        .setDescription('Something went wrong running that command. Try again.');

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ embeds: [errEmbed], ephemeral: true });
      } else {
        await interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }
    }
  },
};