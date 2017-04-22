const Discord = require('discord.js');
const settings = require('./settings.json');

const client = new Discord.Client();

require('./util/eventLoader')(client);

client.login(settings.discordToken);
