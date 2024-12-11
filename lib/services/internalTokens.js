var Client = require('node-rest-client').Client;
const functions = require('../utils/functions');

module.exports = {
  internalTokens: (endpoint, apikey, args, callback, grouper, developer) => {
    client = new Client();

    arg = {
      data:args,
      headers: {
        apikey: apikey,
        'Content-Type': "application/json",
        'X-Source': functions.generateXsourceHeader(grouper, developer)
      }
    };

    client.post(endpoint + "/transaction_gateway/tokens", arg, function (data, response) {
      ret = data;
      err = "";
      callback(ret, err);
    });
  }
}