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
    }

}