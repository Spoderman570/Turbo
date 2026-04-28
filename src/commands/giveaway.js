// commands/giveaway.js
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
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
    )
    .addIntegerOption(option =>
      option
        .setName('winners')
        .setDescription('Number of winners (default: 1)')
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(20)
    ),

  async execute(interaction) {
    const durationMinutes = interaction.options.getInteger('duration');
    const prize = interaction.options.getString('prize');
    const winnerCount = interaction.options.getInteger('winners') ?? 1;

    const durationMs = durationMinutes * 60 * 1000;
    const endTimestamp = Math.floor((Date.now() + durationMs) / 1000);

    // Track participants in memory (keyed by message id after send)
    const participants = new Set();

    // ── Helper: format duration label ─────────────────────────────────────────
    function formatDuration(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const days    = Math.floor(totalSeconds / 86400);
      const hours   = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const parts = [];
      if (days)    parts.push(`${days}d`);
      if (hours)   parts.push(`${hours}h`);
      if (minutes) parts.push(`${minutes}m`);
      return parts.join(' ') || '< 1m';
    }

    // ── Build active giveaway embed ────────────────────────────────────────────
    function buildActiveEmbed(participantCount = 0) {
      return {
        flags: 32768, // IS_COMPONENTS_V2
        components: [
          {
            type: 17, // Container
            accent_color: 0x5865f2,
            components: [
              {
                type: 10, // Text Display
                content: [
                  `# 🎉 Giveaway`,
                  ``,
                  `**Prize:** ${prize}`,
                  `**Host:** ${interaction.user}`,
                  `**Winners:** ${winnerCount}`,
                  `**Duration:** ${formatDuration(durationMs)}`,
                  ``,
                  `> Ends <t:${endTimestamp}:R> — <t:${endTimestamp}:f>`,
                  ``,
                  `Press **Enter Giveaway** to join!`,
                ].join('\n'),
              },
              {
                type: 1, // Action Row
                components: [
                  {
                    type: 2,
                    style: ButtonStyle.Primary,
                    label: 'Enter Giveaway',
                    emoji: { name: '🌐' },
                    custom_id: 'giveaway_enter',
                  },
                  {
                    type: 2,
                    style: ButtonStyle.Secondary,
                    label: `${participantCount}`,
                    emoji: { name: '👥' },
                    custom_id: 'giveaway_count',
                    disabled: true,
                  },
                ],
              },
            ],
          },
        ],
      };
    }

    // ── Build ended embed ──────────────────────────────────────────────────────
    function buildEndedEmbed(winners) {
      const winnerMentions = winners.length
        ? winners.map(u => `${u}`).join(', ')
        : '*No valid entries*';

      return {
        flags: 32768,
        components: [
          {
            type: 17,
            accent_color: 0x2ecc71,
            components: [
              {
                type: 10,
                content: [
                  `# 🎊 Giveaway Ended`,
                  ``,
                  `**Prize:** ${prize}`,
                  `**Host:** ${interaction.user}`,
                  `**Entries:** ${participants.size}`,
                  ``,
                  `**Winner${winners.length !== 1 ? 's' : ''}:** ${winnerMentions}`,
                  ``,
                  `> Ended <t:${endTimestamp}:f>`,
                ].join('\n'),
              },
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: ButtonStyle.Secondary,
                    label: 'Giveaway Ended',
                    emoji: { name: '🏁' },
                    custom_id: 'giveaway_ended',
                    disabled: true,
                  },
                  {
                    type: 2,
                    style: ButtonStyle.Secondary,
                    label: `${participants.size}`,
                    emoji: { name: '👥' },
                    custom_id: 'giveaway_count_final',
                    disabled: true,
                  },
                ],
              },
            ],
          },
        ],
      };
    }

    // ── Send initial message ───────────────────────────────────────────────────
    const message = await interaction.reply({
      ...buildActiveEmbed(0),
      fetchReply: true,
    });

    // ── Collect button interactions ────────────────────────────────────────────
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: i => i.customId === 'giveaway_enter',
      time: durationMs,
    });

    collector.on('collect', async i => {
      if (participants.has(i.user.id)) {
        // Already entered — allow them to leave
        participants.delete(i.user.id);
        await i.reply({
          content: `You've **left** the giveaway for **${prize}**.`,
          ephemeral: true,
        });
      } else {
        participants.add(i.user.id);
        await i.reply({
          content: `🌐 You've **entered** the giveaway for **${prize}**! Good luck!`,
          ephemeral: true,
        });
      }

      // Update participant count on the message
      await message.edit(buildActiveEmbed(participants.size)).catch(() => null);
    });

    // ── End giveaway ───────────────────────────────────────────────────────────
    collector.on('end', async () => {
      const validEntries = [...participants];

      if (!validEntries.length) {
        await message.edit(buildEndedEmbed([])).catch(() => null);
        await interaction.followUp('😔 No one entered the giveaway. No winners this time!');
        return;
      }

      // Pick random winner(s)
      const shuffled = validEntries.sort(() => Math.random() - 0.5);
      const winnerIds = shuffled.slice(0, Math.min(winnerCount, shuffled.length));
      const winnerUsers = await Promise.all(
        winnerIds.map(id => interaction.client.users.fetch(id).catch(() => null))
      );
      const validWinners = winnerUsers.filter(Boolean);

      await message.edit(buildEndedEmbed(validWinners)).catch(() => null);

      const winnerMentions = validWinners.map(u => `${u}`).join(', ');
      await interaction.followUp(
        `🎉 Congratulations ${winnerMentions}! You won **${prize}**!`
      );
    });
  },
};