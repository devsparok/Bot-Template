# Bot Template

A simple Discord bot template built entirely with discord.js v14 and designed to work fully with slash commands.

# Requirements
- `Node.js 18` or newer
- A Discord application and bot created in the Discord Developer Portal

# Setup
1. Download the bot template, either as a ZIP file or by using Git.
2. Open `config.json`.
3. Fill in the values in `config.json` using the credentials of the bot you created in the Discord Developer Portal.
4. Run `npm install && node app.js` to install dependencies and start the bot.
5. Invite the bot to your server. Before doing that, make sure all required intents are enabled.

# Configuration
The bot uses the following values from `config.json`:

```json
{
  "token": "your_bot_token",
  "clientId": "your_application_client_id",
  "developerId": "your_discord_user_id"
}
```

- `token`: Your bot token
- `clientId`: Your application's client ID
- `developerId`: The Discord user ID allowed to use the `eval` command

# Features
- Built with a fully scalable, editable, and updatable structure
- Developed with the latest version of `discord.js`
- Fully supports slash commands
- Includes the core structure a Discord bot project needs
- Comes with a developer-only `eval` command

# Included Commands
- `/ping`: Shows the bot latency
- `/stats`: Shows bot statistics
- `/eval`: Runs JavaScript code for the developer only

# Project Structure
```text
BotTemplate/
|-- app.js
|-- config.json
|-- package.json
|-- src/
|   |-- commands/
|   |   |-- dev/
|   |   |-- utility/
|   |-- events/
|   |-- handlers/
```

# How to Add a Command
1. Create a new `.js` file inside a command category in `src/commands/`.
2. Export a `data` object built with `SlashCommandBuilder`.
3. Export an `execute(client, interaction)` function.
4. Restart the bot to load and deploy the command automatically.

# Notes
- Commands are loaded automatically from the `src/commands` folders.
- Events are loaded automatically from the `src/events` folder.
- Global slash commands can take a short while to refresh on Discord after restarting the bot.
- The `eval` command is restricted to the user ID set in `developerId`.
- Never share your real bot token publicly. If it is ever exposed, regenerate it immediately from the Discord Developer Portal.

# Support or Suggestions
You can join our Discord server to get help or share your suggestions.

# License
This project is licensed under the MIT License.
