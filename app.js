const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const settings = require('./settings.json');
const path = require('path');
const Dota2Api = require('dota2-api');
const sqlite = require('sqlite');

const client = new Commando.Client({
  owner: settings.ownerId
});

client.registry
  .registerGroups([
    ['general', 'General commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then((db) => new CommandoSQLiteProvider(db))
).catch(console.err);

require('./util/eventLoader')(client);

client.dota = Dota2Api.create(settings.dotaToken);

//require('./util/eventLoader')(client);

client.login(settings.discordToken);
