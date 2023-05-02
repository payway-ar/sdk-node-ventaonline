const functions = require('../utils/functions');
var Client = require('node-rest-client').Client;
var constants = require('../utils/constants')
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
                "sub_payments": []
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
    }
}