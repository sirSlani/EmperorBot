const settings = require('../settings.json');

module.exports = (client, message) => {
  if (!message.content.startsWith(settings.prefix)) return;
  let args = message.content.split(' ');
  let command = args.shift().slice(settings.prefix.length);
  
  try {
    let commandModule = require(`../commands/${command}`);
    commandModule.run(client, message, args);
  } catch (err) {
    console.log(`Command ${command} failed.\n${err.stack}`);
  }

}
