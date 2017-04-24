const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const parse = require('yargs-parser');
const DotaApi = require('../../open-dota-api/dota-api');

module.exports = class DotaCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'dota',
      group: 'general',
      memberName: 'dota',
      description: '',
      argsType: 'single'
    });

  }

  async run(message, args) {
    var db = this.client.database;
    var params = parse(args, {
      alias: {
        player: ['u', 'p'],
        remember: ['r'],
        lastGame: ['last', 'l', 'last-game']
      },
      boolean: ['remember', 'lastGame'],
      string: ['player']
    });

    if (!params.player) {
      db.get("SELECT userId, steamId FROM steam WHERE userId='?'", message.author.id, (err, row) => {
        console.log(row);
        if (row === undefined) {
          return message.channel.sendCode('asciicode', "No stored Steam link");
        } else {
          params.player = row.steamId;
        }
      })

    } else {
      DotaApi.searchByName(params.player, (steam) => {
        DotaApi.getPlayerData(steam.account_id, (player) => {
          if (params.remember) {
            db.get("SELECT userId, steamId FROM steam WHERE userId='?'", message.author.id, (err, row) => {
              if (row === undefined) {
                db.run('INSERT INTO steam (userId, steamId) VALUES (?, ?)', [message.author.id, player.profile.personaname]);
              }
            });
          }

          const embed = new Discord.RichEmbed()
            .setTitle(player.profile.personaname)
            .setThumbnail(player.profile.avatarfull)
            .addField('Steam profile: ', player.profile.profileurl)
            .addField('DotaBuff profile: ', `https://www.dotabuff.com/players/${player.profile.account_id}`)
            .addField('Solo MMR: ', player.solo_competitive_rank, true)
            .addField('Party MMR: ', player.competitive_rank, true);

          return message.channel.sendEmbed(embed);
        });
      });
    }

  }
}
