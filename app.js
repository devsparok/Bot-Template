const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const dotenv = require('dotenv');
const {
  Client,
  Collection,
  GatewayIntentBits,
  REST,
  Routes,
} = require('discord.js');

const registerEvents = require('./src/handlers/eventHandler');

dotenv.config({ path: path.join(__dirname, '.env') });

const config = {
  token: process.env.DISCORD_TOKEN ?? process.env.TOKEN ?? '',
  clientId: process.env.DISCORD_CLIENT_ID ?? process.env.CLIENT_ID ?? '',
  developerId: process.env.DEVELOPER_ID ?? '',
};

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.config = config;

function log(scope, message) {
  console.log(`[${scope}] ${message}`);
}

function ensureRequiredConfig() {
  if (!config.token || !config.clientId) {
    throw new Error('The DISCORD_TOKEN/TOKEN and DISCORD_CLIENT_ID/CLIENT_ID values must be set in .env.');
  }
}

function loadCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'src', 'commands');
  const commandFolders = fs
    .readdirSync(commandsPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());
  const commandSources = new Map();

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder.name);
    const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if (!command?.data || typeof command.execute !== 'function') {
        log('WARN', `Skipped invalid command module: ${folder.name}/${file}`);
        continue;
      }

      if (commandSources.has(command.data.name)) {
        const existingFile = commandSources.get(command.data.name);
        throw new Error(
          `Duplicate command name "${command.data.name}" found in "${existingFile}" and "${filePath}".`,
        );
      }

      commandSources.set(command.data.name, filePath);
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      log('COMMAND', `Successfully loaded: ${command.data.name}`);
    }
  }

  return commands;
}

async function deployCommands(commands) {
  const rest = new REST({ version: '10' }).setToken(config.token);

  await rest.put(Routes.applicationCommands(config.clientId), {
    body: commands,
  });

  log('DEPLOY', `Successfully deployed ${commands.length} application command(s).`);
}

async function start() {
  ensureRequiredConfig();
  log('STARTUP', 'Starting bot...');

  const commands = loadCommands();

  registerEvents(client);
  await deployCommands(commands);
  await client.login(config.token);
}

start().catch((error) => {
  console.error('[ERROR] Failed to start the bot.', error);
  process.exit(1);
});
