# 🚀 Turbo Customs — Discord Bot

By Cloudy_9075 on Discord

Make a .env and paste this in -

## Bot token from https://discord.com/developers/applications
DISCORD_TOKEN=

CLIENT_ID=

GUILD_ID= # optional: use this to deploy commands to a specific server for testing

PREFIX=!

## Bot status message
STATUS=🚀 Turbo Customs | /help

## Register slash commands
Run the deployment script after creating your .env:

```bash
npm run deploy
```

If `GUILD_ID` is set, commands will be deployed to that guild only. If it is omitted, commands are deployed globally.
