const Client = require('node-rest-client').Client;
const logger = require('../utils/logger');
const functions = require('../utils/functions');

module.exports = {

    deleteCardToken: (endpoint, apikey, args, tokenizedCard, callback, grouper, developer) => {
        const client = new Client();

        logger.info(`delete tokenized card request with endpoint: ${endpoint}  - tokenizedCard: ${tokenizedCard} - args: ${JSON.stringify(args)} -`)

        const request = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
                'X-Source': functions.generateXsourceHeader(grouper, developer)
            }
        };

        client.delete(`${endpoint}/cardtokens/${tokenizedCard}`, request, function (data, response) {
            let ret = data;
            let err = "";
            if (response.statusCode < 200 || response.statusCode >= 300) {
                err = `Error: Status code ${response.statusCode}`;
            }
            callback(ret, err);
        });
    },

    cardTokens: (endpoint, apikey, userId, callback) => {
        client = new Client();

        const url = `${endpoint}/usersite/${userId}/cardtokens`;

        logger.info(` [ cardTokens ] - requested to endpoint and params: ${url}`);

        const requestOptions = {
            headers: {
                apikey: apikey
            }
        };

        client.get(url, requestOptions, (data, response) => {
            const ret = data;
            const err = "";
            logger.info(` [ cardTokens ] - response: ${JSON.stringify(data)}`);
            callback(ret, err);
        });
    }
}
