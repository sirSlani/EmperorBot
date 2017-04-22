const requireEvent = (event) => require(`../events/${event}`);

module.exports = (client) => {
  client.on('ready', () => requireEvent('ready')(client));
  client.on('message', (message) => requireEvent('message')(client, message));
}