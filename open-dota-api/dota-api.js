const request = require('request');

module.exports = {
  searchByName: (query, callback) => {
      var apiUrl = `https://api.opendota.com/api/search?q=${query}&similarity=1`;

      request(apiUrl, (err, result) => {
        var data = JSON.parse(result.body);
        if (data.length > 0) {
          data = data[0];
          callback(data);
        } else {
          callback({status: "error"})
        }

      });
  },
  getPlayerData: (account_id, callback) => {
    var apiUrl = `https://api.opendota.com/api/players/${account_id}`;

    request(apiUrl, (err, result) => {
      var data = JSON.parse(result.body);
      callback(data);
    })
  },
  getRecentMatches: (account_id, callback) => {
    var apiUrl = `https://api.opendota.com/api/players/${account_id}/recentMatches`;

    request(apiUrl, (err, result) => {
      var data = JSON.parse(result.body);
      callback(data);
    })
  },
  getHeroes: (callback) => {
    var apiUrl = "https://api.opendota.com/api/heroes";

    request(apiUrl, (err, result) => {
      var data = JSON.parse(result.body);
      callback(data);
    });
  }
}
