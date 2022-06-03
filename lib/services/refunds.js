var Client = require('node-rest-client').Client;
var constants = require('../utils/constants')

module.exports = {

 refund :  (args, id, callback)=> {
    client = new Client();
    console.log("dentro de sdk refund")
    client.post(constants.ENDPOINT_DEVELOPER + "/payments/" + id + "/refunds", args,  (data, response)=> {
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
}

}
