const functions = require('../utils/functions');
const Client = require('node-rest-client').Client;
const logger = require('../utils/logger')
const { generateRetailData } = require('../services/fraud_detection/cs_retail');
const { generateTicketingData } = require('../services/fraud_detection/cs_ticketing');
const { generatedigitalGoodsData } = require('../services/fraud_detection/cs_digitalGoods');
const { generateServicesData } = require('../services/fraud_detection/cs_services');
const { generateTravelData } = require('../services/fraud_detection/cs_travel');


const getFraudDetectionArgs = (fraudDetection) => {
    if (!fraudDetection) return null;

    const verticalMap = {
        ticketing_transaction_data: 'ticketing',
        retail_transaction_data: 'retail',
        digital_goods_transaction_data: 'dgs',
        services_transaction_data: 'services',
        travel_data:'travel'
    };

    const verticalConfig = {
        retail: (data) => generateRetailData(data),
        ticketing: (data) => generateTicketingData(data),
        dgs: (data) => generatedigitalGoodsData(data),
        services: (data) => generateServicesData(data),
        travel: (data) => generateTravelData(data)
    };

    for (const key in verticalMap) {
        if (fraudDetection[key]) {
            const vertical = verticalMap[key];
            const sdkFunction = verticalConfig[vertical];
            if (sdkFunction) {
                return sdkFunction(fraudDetection);
            }
        }
    }

    return null;
};

module.exports = {
    getAllPayments: (endpoint, apikey, offset, pageSize, siteOperationId, merchantId, callback) => {
        client = new Client();
        const params = new URLSearchParams();

        if (offset) params.append("offset", offset);
        if (pageSize) params.append("pageSize", pageSize);
        if (siteOperationId) params.append("siteOperationId", siteOperationId);
        if (merchantId) params.append("merchantId", merchantId);

        const url = `${endpoint}/payments?${params.toString()}`;

        logger.info(` [ getAllPayments ] - requested to endpoint and params: ${url}`);

        const requestOptions = {
            headers: {
                apikey: apikey
            }
        };

        client.get(url, requestOptions, (data, response) => {
            const ret = data;
            const err = "";
            logger.info(` [ getAllPayments ] - response: ${JSON.stringify(data)}`);
            callback(ret, err);
        });
    },
    payment: (endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        logger.info(` [ payment ] request with payload: ${JSON.stringify(args, null, 2)}`);

        const fraudDetectionArgs = getFraudDetectionArgs(args.fraud_detection);

        const requestOptions = {
            data: {
                ...args,
                ...(fraudDetectionArgs ? { "fraud_detection": fraudDetectionArgs } : {})
            },
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
            logger.info(` [ payment ] - response: ${JSON.stringify(data)}`);
            callback(ret, err);
        });
    },

    tokenizedPCIPayment: (endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        logger.info(` [ tokenizedPCIPayment ] - request with payload: ${JSON.stringify(args, null, 2)}`);

        arg = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };
        client.post(endpoint + "/payments", arg, function (data, response) {
            ret = data;
            err = "";
            logger.info(` [ tokenizedPCIPayment ] - response: ${JSON.stringify(data)}`);
            callback(ret, err);
        });
    },
    threeDSchallenge: (endpoint, apikey, args, callback, grouper, developer, consumer) => {
        client = new Client();

        logger.info(` [ threeDSchallenge ] -  request with payload: ${JSON.stringify(args, null, 2)}`);

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
            logger.info(` [ threeDSchallenge ] - response: ${JSON.stringify(data)}`);
            callback(ret, err);
        });
    },

    confirmPayment: (id, endpoint, apikey, args, callback, grouper, developer) => {
        client = new Client();

        logger.info(` [ confirmPayment ] - request with payload: ${JSON.stringify(args, null, 2)}`);

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
            logger.info(` [ confirmPayment ] - response: ${JSON.stringify(data)}`);
            callback(ret, err);
        });
    }
}