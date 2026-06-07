const fs = require('node:fs');
const path = require('node:path');

module.exports = (client) => {
  const eventsPath = path.join(__dirname, '..', 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (!event?.name || typeof event.execute !== 'function') {
      console.log(`[WARN] Skipped invalid event module: ${file}`);
      continue;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
      console.log(`[EVENT] Successfully loaded: ${event.name}`);
      continue;
    }

    client.on(event.name, (...args) => event.execute(client, ...args));
    console.log(`[EVENT] Successfully loaded: ${event.name}`);
  }
};
