var Client = require('node-rest-client').Client;
const functions = require('../utils/functions');

module.exports = {
  cryptogramPayment: (endpoint, apikey, args, callback, grouper, developer) => {
    client = new Client();

    args = {
      data: {
        "merchant_id": args.merchant_id,
        "transaction_data": {
          "merchant_transaction_id": args.transaction_data.merchant_transaction_id,
          "original_transaction_id": args.transaction_data.original_transaction_id,
          "payment_method_id": args.transaction_data.payment_method_id,
          "amount": args.transaction_data.amount,
          "currency": args.transaction_data.currency,
          "installments": args.transaction_data.installments,
          "aggregate_data": args.transaction_data.aggregate_data,
          "payment_type": args.transaction_data.payment_type,
          "sub_payments": args.transaction_data.sub_payments,
          "description": args.transaction_data.description,
        },
        "customer_data": {
          "token_id": args.customer_data.token_id,
          "identification_type": args.customer_data.identification_type,
          "identification_number": args.customer_data.identification_number
        },
        "invoice": args.invoice,
        "store_credential": args.store_credential,
      },

      headers: {
        apikey: apikey,
        'Content-Type': "application/json",
        'X-Source': functions.generateXsourceHeader(grouper, developer)
      }
    };

    client.post(endpoint + "/transaction_gateway/payments", args, function (data, response) {
      ret = data;
      err = "";
      callback(ret, err);
    });
  }
}
