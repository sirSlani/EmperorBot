const Commando = require('discord.js-commando');

module.exports = class DotaCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'dota',
      aliases: [],
      group: 'general',
      memberName: 'dota',
      description: 'Dota',
      details: "dota haha",
      examples: ['dota'],
      args: [
        {
          key: 'matchId',
          label: 'm',
          prompt: 'Match ID',
          type: 'string',
          infinite: false
        },
        {
          key: 'playerId',
          label: 'p',
          prompt: 'Player ID',
          type: 'string',
          infinite: false
        }
      ]
    });

  }

  async run(message, args) {
    console.log(args);
    return message.channel.sendMessage("puši kurac");
  }
}
