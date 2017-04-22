const requireEvent = (event) => require(`../events/${event}`);

module.exports = (client) => {
  client.on('error', console.error);
  client.on('warn', console.warn);
  client.on('debug', console.log);
  client.on('ready', () => requireEvent('ready')(client));
  client.on('disconnect', () => requireEvent('disconnect')(client));
  client.on('reconnecting', () => requireEvent('reconnecting')(client));
}
