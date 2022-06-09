var Client = require('node-rest-client').Client;
var constants = require('../utils/constants')

function decimalToInteger(number){
    return (number % 1 != 0) ? number *= 100 : number;
}

module.exports = {

 refund :  (endpoint,args, id, callback)=> {
    client = new Client();
    console.log("dentro de sdk refund")
    client.post(endpoint + "/payments/" + id + "/refunds", args,  (data, response)=> {
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
        ret = data;
        err = "no se detectaron errores en la petición.";

        console.log(data);

        if (!data.hasOwnProperty('status') && !eval(data)) {
            var json = JSON.parse(data);
            json.getErrorType = function () {
                return this.error_type;
            };
            json.getEntityName = function () {
                return this.entity_name;
            };
            json.getId = function () {
                return this.id;
            };
            err = json
            ret = "Ha ocurrido un error.";
        }
        callback(ret, err);
    });
},

partialRefund : (endpoint,args, id, callback)=>{
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
