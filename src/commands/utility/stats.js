const os = require('node:os');
const process = require('node:process');
const {
  EmbedBuilder,
  SlashCommandBuilder,
  version: discordJsVersion,
} = require('discord.js');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(2)} ${units[index]}`;
}

function getFriendlyOS() {
  const type = os.type();
  const release = os.release();

  if (type === 'Windows_NT') {
    const build = parseInt(release.split('.')[2], 10);

    if (build >= 22000) return 'Windows 11';
    if (release.startsWith('10.0')) return 'Windows 10';
    if (release.startsWith('6.3')) return 'Windows 8.1';
    if (release.startsWith('6.2')) return 'Windows 8';
    if (release.startsWith('6.1')) return 'Windows 7';

    return `Windows (${release})`;
  }

  if (type === 'Darwin') return `macOS (${release})`;
  if (type === 'Linux') return `Linux (${release})`;

  return `${type} ${release}`;
}

function createEmbed({ client, interaction, developerLabel }) {
  const memoryUsage = process.memoryUsage();
  const cpuModel = (os.cpus()[0]?.model ?? 'Unknown CPU').replace(/\s+/g, ' ').trim();
  const uptimeSeconds = Math.floor(process.uptime());
  const startedAt = Math.floor((Date.now() - uptimeSeconds * 1000) / 1000);
  const memoryRatio = `${formatBytes(memoryUsage.heapUsed)} / ${formatBytes(memoryUsage.heapTotal)}`;

  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setAuthor({
      name: 'Bot Statistics',
      iconURL: interaction.user.displayAvatarURL({ size: 256 }),
    })
    .setThumbnail(client.user.displayAvatarURL({ size: 256 }))
    .addFields(
      { name: 'Developer', value: developerLabel, inline: true },
      { name: 'Latency', value: `${client.ws.ping} ms`, inline: true },
      { name: 'Uptime', value: `<t:${startedAt}:R>`, inline: true },
      { name: 'Heap Usage', value: memoryRatio, inline: true },
      { name: 'RAM (RSS)', value: formatBytes(memoryUsage.rss), inline: true },
      { name: 'Discord.js', value: `v${discordJsVersion}`, inline: true },
      { name: 'Node.js', value: process.versions.node, inline: true },
      { name: 'Operating System', value: getFriendlyOS(), inline: true },
      { name: 'Architecture', value: os.arch(), inline: true },
      { name: 'CPU', value: cpuModel, inline: false },
    )
    .setFooter({
      text: `Requested by ${interaction.user.username}`,
      iconURL: interaction.user.displayAvatarURL({ size: 256 }),
    })
    .setTimestamp(interaction.createdAt);
}

function resolveDeveloperLabel(client) {
  const developerId = client.config?.developerId;
  return developerId ? `<@${developerId}>` : 'Not configured';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows the bot statistics.'),
  async execute(client, interaction) {
    await interaction.deferReply();

    const developerLabel = resolveDeveloperLabel(client);

    await interaction.editReply({
      embeds: [createEmbed({ client, interaction, developerLabel })],
    });
  },
};
