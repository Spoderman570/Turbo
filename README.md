# 🚀 Turbo Customs — Discord Bot

A clean, purpose-built Discord bot for the Turbo Customs design server.

---

## Setup

### 1. Clone & install

```bash
git clone <your-repo>
cd turbo-customs
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env`:

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal |
| `CLIENT_ID` | Your application's client ID |
| `GUILD_ID` | Guild ID for dev deploy (optional) |
| `PREFIX` | Message command prefix (default `!`) |
| `STATUS` | Bot status message |

### 3. Deploy slash commands

```bash
# Deploy to a single guild instantly (dev)
npm run deploy

# Or edit deploy-commands.js to remove GUILD_ID for global deploy
```

### 4. Start the bot

```bash
# Production
npm start

# Development (auto-restart on save)
npm run dev
```

---

## Commands

### General
| Command | Description |
|---|---|
| `/help` | List all commands |
| `/ping` | Check bot latency |
| `/serverinfo` | Server details |
| `/userinfo [user]` | User profile |

### Design
| Command | Description |
|---|---|
| `/order` | Submit a design order |
| `/portfolio` | View portfolio |
| `/pricing` | View service pricing |

### Moderation *(staff only)*
| Command | Description |
|---|---|
| `/kick <user> [reason]` | Kick a member |
| `/ban <user> [reason] [days]` | Ban a member |
| `/purge <amount>` | Bulk delete messages |

---

## Project Structure

```
turbo-customs/
├── src/
│   ├── index.js              # Entry point
│   ├── deploy-commands.js    # Slash command deployer
│   ├── commands/
│   │   ├── help.js
│   │   ├── ping.js
│   │   ├── serverinfo.js
│   │   ├── userinfo.js
│   │   ├── order.js
│   │   ├── portfolio.js
│   │   ├── pricing.js
│   │   ├── kick.js
│   │   ├── ban.js
│   │   └── purge.js
│   └── events/
│       ├── ready.js
│       └── interactionCreate.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

---

## Adding a Command

1. Create `src/commands/yourcommand.js`
2. Export `data` (SlashCommandBuilder) and `execute(interaction, client)`
3. Run `npm run deploy` to register it

---

## Notes

- The `/order` command posts to a channel named `orders` if it exists in the server
- Moderation commands check Discord permissions automatically via `setDefaultMemberPermissions`
- Never commit your `.env` file
