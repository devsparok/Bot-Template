const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.log(`[WARN] Command not found for interaction: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(client, interaction);
    } catch (error) {
      if (error?.code === 10062) {
        console.warn(`[WARN] Interaction expired before a response was sent: ${interaction.commandName}`);
        return;
      }

      console.error(`[ERROR] Failed to execute command: ${interaction.commandName}`, error);

      const replyOptions = {
        content: 'An unexpected error occurred while running this command.',
        flags: MessageFlags.Ephemeral,
      };

      if (interaction.replied || interaction.deferred) {
        if (interaction.deferred && !interaction.replied) {
          await interaction.editReply(replyOptions).catch(() => null);
          return;
        }

        await interaction.followUp(replyOptions).catch(() => null);
        return;
      }

      await interaction.reply(replyOptions).catch(() => null);
    }
  },
};
