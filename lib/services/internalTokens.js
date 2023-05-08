var Client = require('node-rest-client').Client;
const functions = require('../utils/functions');

module.exports = {
  internalTokens: (endpoint, apikey, args, callback, grouper, developer) => {
    client = new Client();

    args = {
      data: {
        "card_data": {
          "card_number": args.card_data.card_number,
          "expiration_date": args.card_data.expiration_date,
          "card_holder": args.card_data.card_holder,
          "security_code": args.card_data.security_code,
          "account_number": args.card_data.account_number,
          "email_holder": args.card_data.email_holder
        },
        "establishment_number": args.establishment_number
      },

      headers: {
        apikey: apikey,
        'Content-Type': "application/json",
        'X-Source': functions.generateXsourceHeader(grouper, developer)
      }
    };

    client.post(endpoint + "/transaction_gateway/tokens", args, function (data, response) {
      ret = data;
      err = "";
      callback(ret, err);
    });
  }
}