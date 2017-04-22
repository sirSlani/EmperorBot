const settings = require('../settings.json');

module.exports = (message) => {
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(settings.prefix)) return;
  let params = message.content.split(' ');
  let command = params.shift().slice(settings.prefix.length);
  let perms = client.elevation(message);

  let cmd;

  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }

  if (cmd) {
    if (perms < cmd.conf.permLvl) return;
    cmd.run(client, message, params, perms);
  }

}
