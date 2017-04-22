const moment = require('moment');

module.exports = (client) => {
    console.log(`EmperorBot started at ${moment().format("YYYY-MM-DD HH:mm:ss")}; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
}
