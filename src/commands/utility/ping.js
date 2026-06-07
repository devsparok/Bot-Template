const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows the bot latency.'),

  async execute(client, interaction) {
    await interaction.reply({ content: 'Calculating ping...' });
    const reply = await interaction.fetchReply();

    const latency = (reply?.createdTimestamp || 0) - (interaction?.createdTimestamp || 0);
    const apiPing = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({
        name: 'Latency Information',
        iconURL: interaction.user.displayAvatarURL({ size: 256 }),
      })
      .addFields(
        { name: 'Latency', value: `${latency} ms`, inline: true },
        { name: 'API Latency', value: `${apiPing} ms`, inline: true },
      )
      .setFooter({
        text: `Requested by ${interaction.user.username}`,
        iconURL: interaction.user.displayAvatarURL({ size: 256 }),
      })
      .setTimestamp();

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
