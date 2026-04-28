// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const warnCommand = require('./warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear a warning from a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member whose warning will be removed').setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('warning_id').setDescription('Warning ID to remove').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for warning removal').setRequired(false)
    ),

  async execute(interaction) {
    const target    = interaction.options.getUser('user');
    const warningId = interaction.options.getInteger('warning_id');
    const reason    = interaction.options.getString('reason') || 'No reason provided';

    const warns     = warnCommand.warns;
    const userWarns = warns.get(target.id) || [];

    if (userWarns.length === 0) {
      return interaction.reply({ content: 'That user has no warnings.', ephemeral: true });
    }

    if (warningId < 1 || warningId > userWarns.length) {
      return interaction.reply({ content: `Warning ID must be between 1 and ${userWarns.length}.`, ephemeral: true });
    }

    const removed = userWarns.splice(warningId - 1, 1)[0];
    if (userWarns.length === 0) warns.delete(target.id);

    // ── Reply ──────────────────────────────────────────────────────────────────
    await interaction.reply({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: [
                `# Warning Removed`,
                ``,
                `**User:** ${target.tag}`,
                `**Moderator:** ${interaction.user.tag}`,
                `**Removed Warning #:** ${warningId}`,
                `**Removed Warning Reason:** ${removed.reason}`,
                `**Clear Reason:** ${reason}`,
                `**Remaining Warnings:** ${userWarns.length}`,
              ].join('\n'),
            },
          ],
        },
      ],
    });

    // ── DM the user ────────────────────────────────────────────────────────────
    await target.send({
      flags: 32768,
      components: [
        {
          type: 17,
          components: [
            {
              type: 10,
              content: [
                `# A warning was removed in ${interaction.guild.name}`,
                ``,
                `**Removed Warning #:** ${warningId}`,
                `**Removed Warning Reason:** ${removed.reason}`,
                `**Cleared By:** ${interaction.user.tag}`,
                `**Reason for Removal:** ${reason}`,
                `**Remaining Warnings:** ${userWarns.length}`,
              ].join('\n'),
            },
          ],
        },
      ],
    }).catch(() => null);
  },
};
