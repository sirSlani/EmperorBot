const moment = require('moment');

module.exports = (client) => {
  console.log(`Reconnecting at ${moment().format("YYYY-MM-DD HH:mm:ss")}.`)
}
