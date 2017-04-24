const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const settings = require('./settings.json');
const path = require('path');
const sqlite = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const client = new Commando.Client({
  owner: settings.ownerId
});

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then((db) => new Commando.SQLiteProvider(db))
).catch(console.err);

client.registry
  .registerGroups([
    ['general', 'General commands'],
    ['settings', 'Settings commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'));

require('./util/eventLoader')(client);

client.login(settings.discordToken).then(() => {
  client.database = new sqlite3.Database('./data.sqlite3');
  var db = client.database;
  db.run('CREATE TABLE IF NOT EXISTS steam (userId TEXT, steamId TEXT)');
});
