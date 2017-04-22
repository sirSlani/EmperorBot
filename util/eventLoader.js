const requireEvent = (event) => require(`../events/${event}`);

module.exports = (client) => {
  client.on('ready', () => requireEvent('ready')(client));
  client.on('disconnect', () => requireEvent('disconnect')(client));
  client.on('reconnecting', () => requireEvent('reconnecting')(client));
  client.on('message', (message) => requireEvent('message')(client, message));
}
