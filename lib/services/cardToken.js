var Client = require('node-rest-client').Client;
var constants = require('../utils/constants');

module.exports = {

cardTokens : function (endpoint,args, user_id, callback) {

    client = new Client();

    client.get(endpoint + "/usersite/" + user_id + "/cardtokens", args, function (data, response) {
        if (!data.hasOwnProperty('tokens')) {
            var json = JSON.parse(data);
            json.getErrorType = function () {
                return this.error_type;
            };
            
            err = json
            ret = "Ha ocurrido un error.";
        }else{

        
        data.getToken = function () {
            return this.token;
        };
        data.getPaymentMethodId = function () {
            return this.payment_method_id;
        };
        data.getBin = function () {
            return this.bin;
        };
        data.getLastFourDigits = function () {
            return this.last_four_digits;
        };
        data.getExpirationMonth = function () {
            return this.expiration_month;
        };
        data.getExpirationYear = function () {
            return this.expiration_year;
        };
        data.getExpired = function () {
            return this.expired;
        };
        ret = data;
        err = "no se detectaron errores en la petición.";
    }
        callback(ret, err);
    });
}}