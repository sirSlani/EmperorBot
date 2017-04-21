const Discord = require('discord.js');
const settings = require('./settings.json');

const client = new Discord.Client();

let prefix = "$";

client.on('ready', () => {
  console.log('Bot ready');
});

client.on('message', (message) => {
  if (message.content.startsWith(prefix + "ping")) {
    message.channel.sendMessage("Fuck off.");
  }
})

client.login(settings.discordToken);
