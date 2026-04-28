const { EmbedBuilder } = require("discord.js");
const { teams } = require("./teams");

module.exports = async function demoteUser(interaction) {
    const user = interaction.options.getMember("user");
    const teamKey = interaction.options.getString("team");
    const reason = interaction.options.getString("reason");

    const guild = interaction.guild;
    const team = teams[teamKey];

    if (!team) {
        return interaction.reply({ content: "Invalid team selected.", ephemeral: true });
    }

    const categoryRole = guild.roles.cache.get(team.categoryRole);
    const rankRoles = team.ranks.map(r => guild.roles.cache.find(role => role.name === r));

    let currentRankIndex = rankRoles.findIndex(role => user.roles.cache.has(role?.id));

    // If user has category role, demote to highest rank
    if (user.roles.cache.has(categoryRole.id)) {
        user.roles.remove(categoryRole);
        if (rankRoles.length > 0) {
            user.roles.add(rankRoles[rankRoles.length - 1]);
        }
    } else if (currentRankIndex > 0) {
        // Demote to previous rank
        user.roles.remove(rankRoles[currentRankIndex]);
        user.roles.add(rankRoles[currentRankIndex - 1]);
    } else {
        return interaction.reply({
            content: "User is already at the lowest rank in this team.",
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setColor(0xff6b6b)
        .setTitle("User Demoted")
        .addFields(
            { name: "User", value: `${user}`, inline: true },
            { name: "Team", value: team.name, inline: true },
            { name: "Moderator", value: `${interaction.user}`, inline: true },
            { name: "Reason", value: reason }
        )
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
};
