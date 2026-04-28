// commands/giveaway.js — Components V2
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ComponentType,
  ButtonStyle,
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

    const participants = new Set();

    // ── Payload builders ───────────────────────────────────────────────────────

    function buildPayload(participantCount = 0) {
      return {
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: [
                  `# 🎉 ${prize} Giveaway`,
                  ``,
                  `**Host:** ${interaction.user}`,
                  `**Winners:** ${winnerCount}`,
                  `**Participants:** ${participantCount}`,
                  `**Ends:** <t:${endTimestamp}:R>`,
                ].join('\n'),
              },
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: ButtonStyle.Secondary,
                    label: 'Enter Giveaway',
                    emoji: { name: '🌐' },
                    custom_id: 'giveaway_enter',
                  },
                  {
                    type: 2,
                    style: ButtonStyle.Secondary,
                    label: `${participantCount}`,
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

    function buildEndedPayload(winners) {
      const winnerMentions = winners.length
        ? winners.map(u => `${u}`).join(', ')
        : 'No valid entries';

      return {
        flags: 32768,
        components: [
          {
            type: 17,
            components: [
              {
                type: 10,
                content: [
                  `# 🎊 ${prize} Giveaway — Ended`,
                  ``,
                  `**Host:** ${interaction.user}`,
                  `**Winners:** ${winnerMentions}`,
                  `**Total Entries:** ${participants.size}`,
                  `**Ended:** <t:${endTimestamp}:f>`,
                ].join('\n'),
              },
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    style: ButtonStyle.Secondary,
                    label: 'Giveaway Ended',
                    custom_id: 'giveaway_enter',
                    disabled: true,
                  },
                  {
                    type: 2,
                    style: ButtonStyle.Secondary,
                    label: `${participants.size}`,
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

    // ── Send message ───────────────────────────────────────────────────────────

    const message = await interaction.reply({
      ...buildPayload(0),
      fetchReply: true,
    });

    // ── Collect button clicks ──────────────────────────────────────────────────

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: i => i.customId === 'giveaway_enter',
      time: durationMs,
    });

    collector.on('collect', async i => {
      if (participants.has(i.user.id)) {
        participants.delete(i.user.id);
        await i.reply({ content: `❌ You left the **${prize}** giveaway.`, ephemeral: true });
      } else {
        participants.add(i.user.id);
        await i.reply({ content: `🌐 You entered the **${prize}** giveaway! Good luck!`, ephemeral: true });
      }

      await message.edit(buildPayload(participants.size)).catch(() => null);
    });

    // ── End giveaway ───────────────────────────────────────────────────────────

    collector.on('end', async () => {
      const entries = [...participants];

      if (!entries.length) {
        await message.edit(buildEndedPayload([])).catch(() => null);
        await interaction.followUp('😔 No one entered — no winners this time!');
        return;
      }

      const shuffled = entries.sort(() => Math.random() - 0.5);
      const winnerIds = shuffled.slice(0, Math.min(winnerCount, shuffled.length));
      const winnerUsers = await Promise.all(
        winnerIds.map(id => interaction.client.users.fetch(id).catch(() => null))
      );
      const validWinners = winnerUsers.filter(Boolean);

      await message.edit(buildEndedPayload(validWinners)).catch(() => null);

      const mentions = validWinners.map(u => `${u}`).join(', ');
      await interaction.followUp(`🎉 Congratulations ${mentions}! You won **${prize}**!`);
    });
  },
};