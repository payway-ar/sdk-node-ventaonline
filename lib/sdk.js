var Client = require('node-rest-client').Client;
const payments = require('../lib/services/payments');

function decimalToInteger(number){
    return (number % 1 != 0) ? number *= 100 : number;
}

module.exports = {
    sdk: function (environment, publicKey, privateKey) {
        var decidirVersion="1.3.2"
        var publicKey = publicKey;
        var privateKey = privateKey;
        var endpoint;
        if (environment == 'developer') {
            endpoint = 'https://developers.decidir.com/api/v2'
        } else if (environment == 'production') {
            endpoint = 'https://live.decidir.com/api/v2'
        }

        console.log(endpoint)
        // this.healthcheck = function (args, callback) {
        //     client = new Client();

        //     client.get(endpoint + "/healthcheck", args, function (data, response) {
        //         data = JSON.parse(data.toString('utf8'));

        //         data.getName = function (data, response) {
        //             return this.name;
        //         };
        //         data.getVersion = function (data, response) {
        //             return this.version;
        //         };
        //         data.getBuildTime = function (data, response) {
        //             return this.buildTime;
        //         };

        //         ret = data;
        //         err = "No hubo error.";

        //         if (Buffer.isBuffer(data)) {
        //             data = data.toString('utf8');
        //             err = data;
        //         }
        //         callback(ret, err);
        //     });
        // },
        this.getAllPayments = (args, offset, pageSize, siteOperationId, merchantId, callback) => {
            console.log("de la sdk a get all payments")
            payments.getAllPayments(args, offset, pageSize, siteOperationId, merchantId, callback)
        }
    }
}