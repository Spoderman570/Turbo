// ============================================
//   🚀 Turbo Customs Bot
//   Made by Cloudy | Cloudy_9075 on Discord
// ============================================

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const QUOTES = [
  { text: 'Design is not just what it looks like. Design is how it works.', author: 'Steve Jobs' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'Good design is obvious. Great design is transparent.', author: 'Joe Sparano' },
  { text: 'The details are not the details. They make the design.', author: 'Charles Eames' },
  { text: 'Design is thinking made visual.', author: 'Saul Bass' },
  { text: 'Less is more.', author: 'Ludwig Mies van der Rohe' },
  { text: 'Every great design begins with an even better story.', author: 'Lorinda Mamo' },
  { text: 'Color is a power which directly influences the soul.', author: 'Wassily Kandinsky' },
  { text: 'Design is where science and art break even.', author: 'Robin Mathew' },
  { text: 'A user interface is like a joke. If you have to explain it, it\'s not that good.', author: 'Martin LeBlanc' },
  { text: 'The best design is the one you don\'t notice.', author: 'Unknown' },
  { text: 'Make it simple, but significant.', author: 'Don Draper' },
  { text: 'Styles come and go. Good design is a language, not a style.', author: 'Massimo Vignelli' },
  { text: 'Design adds value faster than it adds costs.', author: 'Joel Spolsky' },
  { text: 'Good design is as little design as possible.', author: 'Dieter Rams' },
  { text: 'Design creates culture. Culture shapes values. Values determine the future.', author: 'Robert L. Peters' },
  { text: 'Design is intelligence made visible.', author: 'Alina Wheeler' },
  { text: 'People ignore design that ignores people.', author: 'Frank Chimero' },
  { text: 'Content precedes design. Design in the absence of content is not design, it’s decoration.', author: 'Jeffrey Zeldman' },
  { text: 'You can’t use up creativity. The more you use, the more you have.', author: 'Maya Angelou' },
  { text: 'Design is not for philosophy, it’s for life.', author: 'Issey Miyake' },
  { text: 'Recognizing the need is the primary condition for design.', author: 'Charles Eames' },
  { text: 'If you think good design is expensive, you should look at the cost of bad design.', author: 'Ralf Speth' },
  { text: 'A designer knows he has achieved perfection not when there is nothing left to add, but when there is nothing left to take away.', author: 'Antoine de Saint-Exupéry' },
  { text: 'Design is an opportunity to continue telling the story, not just to sum everything up.', author: 'Tate Linden' },
  { text: 'The function of design is letting design function.', author: 'Micha Commeren' },
  { text: 'Design is a solution to a problem. Art is a question to a problem.', author: 'John Maeda' },
  { text: 'Usability is about people and how they understand and use things, not about technology.', author: 'Steve Krug' },
  { text: 'A great product is built by teams who care deeply about the people who use it.', author: 'Unknown' },
  { text: 'Design is the silent ambassador of your brand.', author: 'Paul Rand' },
  { text: 'Creativity is allowing yourself to make mistakes. Design is knowing which ones to keep.', author: 'Scott Adams' },
  { text: 'Design is about making things good and then better.', author: 'Unknown' },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get a random design quote'),

  async execute(interaction) {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    const embed = new EmbedBuilder()
      .setColor(0x00b8fd)
      .setDescription(`*"${q.text}"*`)
      .setFooter({ text: `— ${q.author}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};