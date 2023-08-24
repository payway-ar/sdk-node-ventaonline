const functions = require('../utils/functions');
var Client = require('node-rest-client').Client;
var constants = require('../utils/constants')

function decimalToInteger(number) {
    return Number.isInteger(number) ? number : Math.floor(number * 100);
}
module.exports = {
    getAllPayments: (args, offset, pageSize, siteOperationId, merchantId, callback) => {
        client = new Client();
        var queryString = "";
        if (offset !== "" && offset !== undefined) {
            queryString += "offset=" + offset + "&";
        }
        if (pageSize !== "" && pageSize !== undefined) {
            queryString += "pageSize=" + pageSize + "&";
        }
        if (siteOperationId !== "" && siteOperationId !== undefined) {
            queryString += "siteOperationId=" + siteOperationId + "&";
        }
        if (merchantId !== "" && merchantId !== undefined) {
            queryString += "merchantId=" + merchantId + "&";
        }

        console.log("antes de hacer la consulta")
        client.get(constants.ENDPOINT_DEVELOPER + "/payments?" + queryString, args, (data, response) => {
            data.getLimit = function () {
                return this.limit;
            };
            data.getOffset = function (data, response) {
                return this.offset;
            };
            data.getResults = function () {
                return this.site_transaction_id;
            };
            data.hasMore = function () {
                return this.hasMore;
            };

            ret = data;
            err = "no se detectaron errores en la petición.";
            if (Buffer.isBuffer(data)) {
                data = data.toString('utf8');
                err = data;
                ret = "Ha ocurrido un error.";
            }
            callback(ret, err);
        });
    },
    payment: (endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();
        let auth_3ds_data = {};
        if (args.hasOwnProperty("cardholder_auth_required") && !functions.isEmpty(args.cardholder_auth_required) && args.cardholder_auth_required === true){
            auth_3ds_data = {
                device_type: args.auth_3ds_data.device_type,
                accept_header: args.auth_3ds_data.accept_header,
                user_agent: args.auth_3ds_data.user_agent,
                ip: args.auth_3ds_data.ip,
                java_enabled: args.auth_3ds_data.java_enabled,
                language: args.auth_3ds_data.language,
                color_depth: args.auth_3ds_data.color_depth,
                screen_height: args.auth_3ds_data.screen_height,
                screen_width: args.auth_3ds_data.screen_width,
                time_zone_offset: args.auth_3ds_data.time_zone_offset
            }
        }

        args = {
            data: {
                "site_transaction_id": args.site_transaction_id,
                "token": args.token,
                "payment_method_id": args.payment_method_id,
                "bin": args.bin,
                "amount": args.amount,
                "currency": args.currency,
                "installments": args.installments,
                "payment_type": args.payment_type,
                "sub_payments": [],
                "cardholder_auth_required": args.cardholder_auth_required,
                "auth_3ds_data": auth_3ds_data
            },
            
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };
        client.post(endpoint + "/payments", args, function (data, response) {
            console.log("OBJETO: " + args)
            ret = data;
            err = "";
            console.log(data);
            callback(ret, err);
        });
    },

    tokenizedPCIPayment: (endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        args = {
            data: {
                "site_transaction_id": args.site_transaction_id,
                "payment_method_id": args.payment_method_id,
                "bin": args.bin,
                "amount": args.amount,
                "currency": args.currency,
                "installments": args.installments,
                "payment_type": args.payment_type,
                "sub_payments": args.sub_payments,
                "fraud_detection": args.fraud_detection,
                "card_data": args.card_data,
                "is_tokenized_payment": args.is_tokenized_payment,
                "token_card_data": args.token_card_data,
                "aggregate_data": args.aggregate_data
            },

            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };
        client.post(endpoint + "/payments", args, function (data, response) {
            console.log("OBJETO: " + args)
            ret = data;
            err = "";
            console.log(data);
            callback(ret, err);
        });
    },
    threeDSchallenge: (endpoint, apikey, args, callback, grouper, developer, consumer) => {
        client = new Client();
    
        args = {
          data: {
            "id": args.id,
            "instruction_value": args.instruction_value
          },
    
          headers: {
            'apikey': apikey,
            'Content-Type': "application/json",
            'X-Source': functions.generateXsourceHeader(grouper, developer),
            'X-Consumer-Username' : consumer
          }
        };
    
        client.post(endpoint + "/threeds/instruction", args, function (data, response) {
          ret = data;
          err = "";
          callback(ret, err);
        });
      },

    confirmPayment: (id, endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        args = {
            data: {
                "amount": decimalToInteger(args.amount)
            },
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };

        client.put(`${endpoint}/payments/${id}`, args, function (data, response) {
            ret = data;
            err = "";
            callback(ret, err);
        });
    }
}