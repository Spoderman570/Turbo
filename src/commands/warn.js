// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// In-memory warn store (replace with a DB like sqlite/mongoose for persistence)
const warns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to warn').setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for warn').setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

    if (!warns.has(target.id)) warns.set(target.id, []);
    warns.get(target.id).push({ reason, mod: interaction.user.tag, time: Date.now() });
    const count = warns.get(target.id).length;

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
                `# Member Warned`,
                ``,
                `**User:** ${target}`,
                `**Moderator:** ${interaction.user}`,
                `**Total Warns:** ${count}`,
                `**Reason:** ${reason}`,
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
                `# You were warned in ${interaction.guild.name}`,
                ``,
                `**Reason:** ${reason}`,
                `**Total Warnings:** ${count}`,
              ].join('\n'),
            },
          ],
        },
      ],
    }).catch(() => null);
  },

  warns, // export so /warnings can access it
};
