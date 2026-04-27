// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const warnCommand = require('./warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('Member to check').setRequired(true)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const userWarns = warnCommand.warns.get(target.id) || [];

    const embed = new EmbedBuilder()
      .setColor(0x00b8fd)
      .setTitle(`Warnings — ${target.tag}`)
      .setThumbnail(target.displayAvatarURL());

    if (userWarns.length === 0) {
      embed.setDescription('No warnings on record.');
    } else {
      userWarns.forEach((w, i) => {
        embed.addFields({
          name: `Warning #${i + 1}`,
          value: `**Reason:** ${w.reason}\n**Mod:** ${w.mod}\n**When:** <t:${Math.floor(w.time / 1000)}:R>`,
        });
      });
    }

    embed.setFooter({ text: `${userWarns.length} total warning(s)` }).setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};