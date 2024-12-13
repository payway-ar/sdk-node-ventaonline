const functions = require('../utils/functions');
const Client = require('node-rest-client').Client;
const constants = require('../utils/constants')
const logger = require('../utils/logger')

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

        logger.info(`Payload: ${JSON.stringify(args, null, 2)}`);

        const requestOptions = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer),
            }
        };

        logger.info(`Payment Request - Endpoint: ${endpoint}/payments`);
        logger.info(`Headers: ${JSON.stringify({
            apikey: apikey,
            'Content-Type': "application/json",
            'X-Source': functions.generateXsourceHeader(grouper, developer),
        }, null, 2)}`);
       
        client.post(`${endpoint}/payments`, requestOptions, (data, response) => {
            const ret = data;
            const err = "";
            console.log(data);
            callback(ret, err);
        });
    },

    tokenizedPCIPayment: (endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        arg = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };
        client.post(endpoint + "/payments", arg, function (data, response) {
            console.log("OBJETO: " + args)
            ret = data;
            err = "";
            console.log(data);
            callback(ret, err);
        });
    },
    threeDSchallenge: (endpoint, apikey, args, callback, grouper, developer, consumer) => {
        client = new Client();

        arg = {
            data: args,
            headers: {
                'apikey': apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer),
                'X-Consumer-Username': consumer
            }
        };

        client.post(endpoint + "/threeds/instruction", arg, function (data, response) {
            ret = data;
            err = "";
            callback(ret, err);
        });
    },

    confirmPayment: (id, endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        arg = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };

        client.put(`${endpoint}/payments/${id}`, arg, function (data, response) {
            ret = data;
            err = "";
            callback(ret, err);
        });
    }
}