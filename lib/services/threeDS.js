var Client = require('node-rest-client').Client;

module.exports = {
  threeDSinstruction: (endpoint, apikey, args, callback, grouper, developer) => {
    client = new Client();

    arg = {
      data: args,
      headers: {
        apikey: apikey,
        'Content-Type': "application/json",
        'X-Source': functions.generateXsourceHeader(grouper, developer)
      }
    };

    client.post(endpoint + "/threeds/instruction", arg, function (data, response) {
      ret = data;
      err = "";
      callback(ret, err);
    });
  }
}