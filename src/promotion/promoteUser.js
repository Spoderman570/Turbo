const { EmbedBuilder } = require("discord.js");
const { teams } = require("./teams");

module.exports = async function promoteUser(interaction) {
    const user = interaction.options.getMember("user");
    const teamKey = interaction.options.getString("team");
    const reason = interaction.options.getString("reason");

    const guild = interaction.guild;
    const team = teams[teamKey];

    if (!team) {
        return interaction.reply({ content: "Invalid team selected.", ephemeral: true });
    }

    // Prevent promoting above Executive
    if (teamKey === "executive") {
        return interaction.reply({
            content: "You cannot promote above Executive without manual override.",
            ephemeral: true
        });
    }

    // Category role (team top role)
    const categoryRole = guild.roles.cache.get(team.categoryRole);

    // FIXED: Match ranks by ID, not name
    const rankRoles = team.ranks.map(id => guild.roles.cache.get(id));

    // Find user's current rank index
    let currentRankIndex = rankRoles.findIndex(role => role && user.roles.cache.has(role.id));

    // Promote to next rank
    if (currentRankIndex + 1 < rankRoles.length) {
        const nextRank = rankRoles[currentRankIndex + 1];

        if (!nextRank) {
            return interaction.reply({ content: "Next rank role not found.", ephemeral: true });
        }

        // Remove old rank
        if (currentRankIndex >= 0) {
            const oldRank = rankRoles[currentRankIndex];
            if (oldRank) user.roles.remove(oldRank);
        }

        // Add new rank
        await user.roles.add(nextRank);

    } else {
        // Promote into category role
        if (!user.roles.cache.has(categoryRole.id)) {
            await user.roles.add(categoryRole);
        } else {
            return interaction.reply({
                content: "User is already at the highest rank in this team.",
                ephemeral: true
            });
        }
    }

    // Logging embed
    const embed = new EmbedBuilder()
        .setTitle("Promotion Logged")
        .setColor("#4CAF50")
        .addFields(
            { name: "User", value: `${user}`, inline: true },
            { name: "Team", value: team.name, inline: true },
            { name: "Reason", value: reason }
        )
        .setTimestamp();

    const logChannel = guild.channels.cache.find(c => c.name === "promotion-logs");
    if (logChannel) logChannel.send({ embeds: [embed] });

    return interaction.reply({
        content: `Promoted ${user} in **${team.name}**.`,
        ephemeral: false
    });
};
