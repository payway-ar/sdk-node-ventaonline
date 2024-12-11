var Client = require('node-rest-client').Client;
const functions = require('../utils/functions');

module.exports = {
  checkoutHash: (endpoint, apikey, args, callback, grouper, developer) => {
    client = new Client();

    args = {
        data: args,
        headers: {
          'apikey': apikey,
          'Content-Type': "application/json",
          'X-Source': functions.generateXsourceHeader(grouper, developer)
        }
    };

    client.post(endpoint + "/payments/link", args, function (data, response) {
      ret = data;
      err = "";
      callback(ret, err);
    });
  }
}