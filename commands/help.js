const settings = require('../settings.json');

exports.run = (client, message, params, perms) => {
  const commands = Array.from(client.commands.keys());
  const longest = commands.reduce((long, str) => Math.max(long, str.length), 0);
  message.channel.sendCode('asciidoc', `${client.commands.map((command) => `${settings.prefix}${command.help.name}${' '.repeat(longest - command.help.name.length)} : ${command.help.description}`).join('\n')}`);
}

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'help',
  description: 'Lists all commands.',
  usage: 'help'
}
