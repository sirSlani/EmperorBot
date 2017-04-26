const Commando = require('discord.js-commando');
const Discord = require('discord.js');
const parse = require('yargs-parser');
const DotaApi = require('../../open-dota-api/dota-api');
const moment = require('moment');

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
          if (params.lastGame) {
              DotaApi.getRecentMatches(steam.account_id, (matches) => {
                const lastMatch = matches[0];
                const side = !!(lastMatch.player_slot & 128);
                console.log(side ? "Dire" : "Radiant")
                const won = side && lastMatch.radiant_win;
                console.log(lastMatch.radiant_win ? "Radiant Won" : "Dire Won");

                const hero = this.client.heroes.find((val, x) => {
                  return val.id == lastMatch.hero_id;
                });

                const duration = {}
                duration.seconds = lastMatch.duration % 60;
                duration.hours = Math.floor(lastMatch.duration / 3600);
                duration.minutes = Math.floor((lastMatch.duration - 3600 * duration.hours) / 60);

                const embed = new Discord.RichEmbed()
                  .setColor(0x234567)
                  .setTitle(player.profile.personaname)
                  .setThumbnail(`http://cdn.dota2.com/apps/dota2/images/heroes/${hero.name.slice(14)}_full.png`)
                  .addField('DotaBuff match: ', `https://www.dotabuff.com/matches/${lastMatch.match_id}`)
                  .addField("Result:", (won) ? "Won Match" : "Lost Match", true)
                  .addField("Duration:", `${moment({hour: duration.hours, minute: duration.minutes, second: duration.seconds}).format('HH:mm:ss')}`, true)
                  .addField("Hero:", `${hero.localized_name}`, true)
                  .addField("KDA:", `${lastMatch.kills}/${lastMatch.deaths}/${lastMatch.assists}`, true)
                  .addField("CS:", `${lastMatch.last_hits}`, true)
                  .addField("GPM:", `${lastMatch.gold_per_min}`, true)
                  .addField("XPM:", `${lastMatch.xp_per_min}`, true)
                  .addField("Hero Damage:", `${lastMatch.tower_damage}`, true)
                  .addField("Tower Damage:", `${lastMatch.hero_damage}`, true)
                  .addField("Hero Healing:", `${lastMatch.hero_healing}`, true);

                return message.channel.sendEmbed(embed);
              });
          } else {
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
          }
        });
      });
    });

  }
}
