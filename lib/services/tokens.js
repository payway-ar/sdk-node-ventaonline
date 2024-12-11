var Client = require('node-rest-client').Client;
var constants = require('../utils/constants');
const functions = require('../utils/functions');

module.exports = {
    tokens: (endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        console.log("args object: " + JSON.stringify(args));

        arg = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper,developer)
            }
        };

        console.log("POST tokens: " + JSON.stringify(args));


        client.post(endpoint + "/tokens", arg, function (data, response) {
            ret = data;
            err = "";
            callback(ret, err);
        });
    }
}