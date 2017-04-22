exports.run = (client, message, params, perms) => {
  message.channel.sendMessage("Fuck off!");
}

exports.conf = {
  enabled: true,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'ping',
  description: '?',
  usage: 'ping'
}
