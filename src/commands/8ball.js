// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const RESPONSES = [
  { text: 'It is certain.', type: 'pos' },
  { text: 'Without a doubt.', type: 'pos' },
  { text: 'Yes, definitely.', type: 'pos' },
  { text: 'You may rely on it.', type: 'pos' },
  { text: 'As I see it, yes.', type: 'pos' },
  { text: 'Most likely.', type: 'pos' },
  { text: 'Outlook good.', type: 'pos' },
  { text: 'Signs point to yes.', type: 'pos' },
  { text: 'Reply hazy, try again.', type: 'neu' },
  { text: 'Ask again later.', type: 'neu' },
  { text: 'Cannot predict now.', type: 'neu' },
  { text: 'Concentrate and ask again.', type: 'neu' },
  { text: "Don't count on it.", type: 'neg' },
  { text: 'My reply is no.', type: 'neg' },
  { text: 'My sources say no.', type: 'neg' },
  { text: 'Outlook not so good.', type: 'neg' },
  { text: 'Very doubtful.', type: 'neg' },
];

const COLORS = { pos: 0x2ed573, neu: 0xf9ca24, neg: 0xff4757 };

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8-ball a question')
    .addStringOption(opt =>
      opt.setName('question').setDescription('Your question').setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const response = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];

    const embed = new EmbedBuilder()
      .setColor(COLORS[response.type])
      .addFields(
        { name: 'Question', value: question },
        { name: '🎱 Answer', value: response.text },
      )
      .setFooter({ text: `Asked by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};