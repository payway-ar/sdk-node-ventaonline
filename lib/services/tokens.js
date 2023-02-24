var Client = require('node-rest-client').Client;
var constants = require('../utils/constants');
const functions = require('../utils/functions');

module.exports = {
    tokens: (endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        args = {
            data: {

                "card_number": args.card_number,
                "card_expiration_month": args.card_expiration_month,
                "card_expiration_year": args.card_expiration_year,
                "card_holder_name": args.card_holder_name,
                "card_holder_birthday": args.card_holder_birthday,
                "card_holder_door_number": args.card_holder_door_number,
                "security_code": args.security_code,
                "card_holder_identification": {
                    "type": args.card_holder_identification.type,
                    "number": args.card_holder_identification.number
                }
            },

            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper,developer)
            }
        };

        client.post(endpoint + "/tokens", args, function (data, response) {
            ret = data;
            err = "";
            callback(ret, err);
        });
    }
}