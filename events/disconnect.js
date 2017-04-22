const moment = require('moment');

module.exports = (client) => {
  console.log(`Disconnected at ${moment().format("YYYY-MM-DD HH:mm:ss")}.`)
}
