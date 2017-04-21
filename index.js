const Discord = require('discord.js');
const Dota2Api = require('dota2-api');
const client = new Discord.Client();
const settings = require('./settings.json');

const dota = Dota2Api.create('501CF06D05801FE0ADE5D5C991F335DD');

const wiseWords = ['May the shining light of the imperium protect us and guide us.',
                   'We will no longer surrender our country or its people to the false song of globalism.'];

client.on('ready', () => {
  console.log('Bot ready.')
  var options = {
    account_id: 80209603,
    matches_requested: 1
  };
  dota.getMatchHistory(options).then((result) => {
    var match = result.result.matches[0];
    var options = {
      match_id: match.match_id
    };
    dota.getMatchDetails(options).then((result) => {
      console.log(result);
    });
  });
});

client.on('message', (message) => {

});

client.login(settings.discordToken);
