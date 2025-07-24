const functions = require('sdk-node-payway/lib/utils/functions');
const Client = require('node-rest-client').Client;
const logger = require('sdk-node-payway/lib/utils/logger')



module.exports = {
    healthcheck: (endpoint, apikey, callback) => {
        client = new Client();

        const url = `${endpoint}/healthcheck`;

        logger.info(` [ healthcheck ] - requested to endpoint and params: ${url}`);

        const requestOptions = {
            headers: {
                apikey: apikey
            }
        };

        client.get(url, requestOptions, (data, response) => {
            try {
                if (Buffer.isBuffer(data)) {
                    data = data.toString('utf8');
                }
    
                const jsonData = JSON.parse(data);
    
                logger.info(` [ healthcheck ] - response: ${JSON.stringify(jsonData)}`);
    
                callback(jsonData, "");
            } catch (error) {
                logger.error(`Error procesando la respuesta del healthcheck: ${error.message}`);
                callback(null, error.message);
            }
        });
    }
}