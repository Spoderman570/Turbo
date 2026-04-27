const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const demoteUser = require("../promotion/demoteUser");
const { teams } = require("../promotion/teams");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("demote")
        .setDescription("Demote a user within their team.")
        .addUserOption(opt =>
            opt.setName("user").setDescription("User to demote").setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("team")
                .setDescription("Team to demote within")
                .setRequired(true)
                .addChoices(
                    ...Object.keys(teams).map(key => ({
                        name: teams[key].name,
                        value: key
                    }))
                )
        )
        .addStringOption(opt =>
            opt.setName("reason").setDescription("Reason for demotion").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        demoteUser(interaction);
    }
};
