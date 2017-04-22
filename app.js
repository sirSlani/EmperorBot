const Discord = require('discord.js');
const settings = require('./settings.json');
const fs = require('fs');
const moment = require('moment');

const client = new Discord.Client();

require('./util/eventLoader')(client);

const log = (message) => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading ${files.length} commands.`);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log(`Loading command: ${props.help.name}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach((alias) => {
      client.aliases.set(alias, props.help.name);
    })
  })
});

client.elevation = (message) => {
  let permLvl = 0;
  if (message.author.id == settings.ownerId) permLvl = 4;
  return permLvl;
}

client.reload = (command) => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./commands/${command}`)];
      let cmd = require(`./commands/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd == command) {
          client.aliases.delete(alias);
        }
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach((alias) => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch(err) {
      reject(err);
    }
  })
}

client.login(settings.discordToken);
