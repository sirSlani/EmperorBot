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
      examples: ['dota -m 66630044'],
      args: [
        {
          key: 'match-id',
          label: 'm',
          prompt: 'Match id',
          type: 'string',
          infinite: false
        }
      ]
    });

  }

  async run(msg, args) {
    return msg.reply("puši kurac");
  }
}
