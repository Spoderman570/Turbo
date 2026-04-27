const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const promoteUser = require("../promotion/promoteUser");
const { teams } = require("../promotion/teams");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("promote")
        .setDescription("Promote a user within their team.")
        .addUserOption(opt =>
            opt.setName("user")
                .setDescription("User to promote")
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName("team")
                .setDescription("Team to promote within")
                .setRequired(true)
                .addChoices(
                    ...Object.keys(teams).map(key => ({
                        name: teams[key].name,
                        value: key
                    }))
                )
        )
        .addStringOption(opt =>
            opt.setName("reason")
                .setDescription("Reason for promotion")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        promoteUser(interaction);
    }
};
