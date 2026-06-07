const util = require('node:util');
const { MessageFlags, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Runs JavaScript code.')
    .addStringOption((option) =>
      option
        .setName('code')
        .setDescription('The JavaScript code to run.')
        .setRequired(true),
    ),
  async execute(client, interaction) {
    if (interaction.user.id !== client.config.developerId) {
      await interaction.reply({
        content: 'You cannot use this command.',
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const code = interaction.options.getString('code', true);
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    try {
      const result = await eval(code);
      const output = typeof result === 'string' ? result : util.inspect(result, { depth: 1 });

      await interaction.editReply(`\`\`\`js\n${output || 'Completed.'}\n\`\`\``);
    } catch (error) {
      await interaction.editReply(`\`\`\`js\n${error}\n\`\`\``);
    }
  },
};
