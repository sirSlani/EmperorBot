const Commando = require('discord.js-commando');

module.exports = class SetSteamIDCommand extends Commando.Command {

  constructor(client) {
    super(client, {
      name: 'setsteamid',
      aliases: [],
      group: 'settings',
      memberName: 'setsteamid',
      description: 'Sets Steam ID for user.',
      details: "hehe",
      examples: ['setsteamid 666'],
      args: [
        {
          key: 'steamId',
          label: 'steamId',
          prompt: 'Steam ID',
          type: 'string',
          infinite: false
        }
      ]
    });
  }

  async run(message, args) {
    message.guild.settings.set(`user(${message.author.id}).steamID`, args.steamId);

    return message.channel.sendMessage("SteamID set.");
  }
}
