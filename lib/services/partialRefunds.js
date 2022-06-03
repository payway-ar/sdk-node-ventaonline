var Client = require('node-rest-client').Client;
var constants = require('../utils/constants')

module.exports = {

    partialRefund : (args, id, callback)=>{
        client = new Client();
        args.data.amount = decimalToInteger(args.data.amount);
    
        client.post(endpoint + "/payments/" + id + "/refunds", args,  (data, response)=> {
            if (!data.hasOwnProperty('status')) {
    
                data.getErrorType = function () {
                    return this.error_type;
                };
                data.getValidationErrors = function () {
                    return this.validation_errors;
                };
                err = data
                ret = "Ha ocurrido un error.";
            } else {
                data.getStatus = function () {
                    return this.status;
                };
                data.getId = function () {
                    return this.id;
                };
                data.getAmount = function () {
                    return this.amount;
                };
                data.getSubPayments = function () {
                    return this.sub_payments;
                };
                if (!args.data.amount % 1 == 0) {
                    data.amount = data.amount / 100;
                }
                ret = data;
                err = "no se detectaron errores en la petición.";
    
            }
            callback(ret, err);
        });
    }
    
    }