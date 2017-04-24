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

    var player = params.player;

    db.get("SELECT userId, steamId FROM steam WHERE userId=?", message.author.id, (err, row) => {
      if (!player) {
        if (row !== undefined) {
          player = row.steamId;
        } else {
          return message.channel.sendCode('asciicode', "No stored Steam link.");
        }
      }

      DotaApi.searchByName(player, (steam) => {
        if (steam.status == "error") {
          return message.channel.sendCode('asciicode', "Player not found.");
        }
        DotaApi.getPlayerData(steam.account_id, (player) => {
          if (params.remember) {
            db.get("SELECT userId, steamId FROM steam WHERE userId=?", message.author.id, (err, row) => {
              if (row === undefined) {
                db.run('INSERT INTO steam (userId, steamId) VALUES (?, ?)', [message.author.id, player.profile.personaname]);
              } else {
                db.run('UPDATE steam SET steamId=? WHERE userId=?', [player.profile.personaname, message.author.id]);
              }
            });
          }

          const embed = new Discord.RichEmbed()
            .setColor(0x123456)
            .setTitle(player.profile.personaname)
            .setThumbnail(player.profile.avatarfull)
            .setURL(player.profile.profileurl)
            .addField('DotaBuff profile: ', `https://www.dotabuff.com/players/${player.profile.account_id}`)
            .addField('OpenDota profile: ', `https://www.opendota.com/players/${player.profile.account_id}`)
            .addField('Solo MMR: ', player.solo_competitive_rank, true)
            .addField('Party MMR: ', player.competitive_rank, true)
            .setFooter('Powered by OpenDota');

          return message.channel.sendEmbed(embed);
        });
      });
    });

  }
}
