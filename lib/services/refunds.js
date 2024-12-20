const Client = require('node-rest-client').Client;
const logger = require('../utils/logger');
const functions = require('../utils/functions');

module.exports = {

    refund: (endpoint, apikey, id, callback, grouper, developer) => {
        client = new Client();

        logger.info(`refund request with endpoint: ${endpoint}  - chargeId: ${id}`)

        args = {};

        arg = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };

        client.post(`${endpoint}/payments/${id}/refunds`, arg, function (data, response) {
            ret = data;
            err = "";
            callback(ret, err);
        });
    },

    partialRefund: (endpoint, apikey, args, id, callback, grouper, developer) => {

        logger.info(`partial refund request with endpoint: ${endpoint} - args: ${JSON.stringify(args)} - chageId: ${id}`)

        client = new Client();

        args.headers = {
            apikey: apikey,
            'Content-Type': "application/json",
            'X-Source': functions.generateXsourceHeader(grouper, developer)
        };

        client.post(`${endpoint}/payments/${id}/refunds`, args, function (data, response) {
            ret = data;
            err = "";
            callback(ret, err);
        });
    },

     deleteRefund: (endpoint, apikey, args, paymentId, refundId, callback, grouper, developer) => {
            const client = new Client();
    
            logger.info(`delete refund request with endpoint: ${endpoint}  - paymentId: ${paymentId} - refundId: ${refundId} -  args: ${JSON.stringify(args)} -`)
    
            const request = {
                data: args,
                headers: {
                    apikey: apikey,
                    'Content-Type': "application/json",
                    'X-Source': functions.generateXsourceHeader(grouper, developer)
                }
            };
    
            client.delete(`${endpoint}/payments/${paymentId}/refunds/${refundId}`, request, function (data, response) {
                let ret = data;
                let err = "";
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    err = `Error: Status code ${response.statusCode}`;
                }
                callback(ret, err);
            });
        },
    
        deletePartialRefund: (endpoint, apikey, args, paymentId, callback, grouper, developer) => {
            const client = new Client();
    
            logger.info(`delete partial refund request with endpoint: ${endpoint} - paymentId: ${paymentId} - args: ${JSON.stringify(args)} -`)
    
            const request = {
                data: args,
                headers: {
                    apikey: apikey,
                    'Content-Type': "application/json",
                    'X-Source': functions.generateXsourceHeader(grouper, developer)
                }
            };
    
            client.delete(`${endpoint}/payments/${paymentId}/refunds`, request, function (data, response) {
                let ret = data;
                let err = "";
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    err = `Error: Status code ${response.statusCode}`;
                }
                callback(ret, err);
            });
        }
        
}