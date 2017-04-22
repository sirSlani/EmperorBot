const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const settings = require('./settings.json');
const path = require('path');
const Dota2Api = require('dota2-api');
const sqlite = require('sqlite');

const client = new Commando.Client({
  owner: settings.ownerId
});

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then((db) => new CommandoSQLiteProvider(db))
).catch(console.err);

client.registry
  .registerGroups([
    ['general', 'General commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

require('./util/eventLoader')(client);

client.dota = Dota2Api.create(settings.dotaToken);

client.login(settings.discordToken);
