const { ActivityType, Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setPresence({
      activities: [
        {
          name: 'developed with 🩷',
          type: ActivityType.Playing,
        },
      ],
      status: 'online',
    });

    console.log(`[BOT] Logged in as ${client.user.tag}`);
  },
};
