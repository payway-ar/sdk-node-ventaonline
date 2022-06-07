var Client = require('node-rest-client').Client;
var constants = require('../utils/constants')

module.exports = {
tokens : function (args, callback) {
    client = new Client();

    args = {
        data: {
            
            "card_number" : args.card_number,
            "card_expiration_month" : args.card_expiration_month,
            "card_expiration_year" : args.card_expiration_year, 
            "card_holder_name" : args.card_holder_name,
            "card_holder_birthday" : args.card_holder_birthday,
            "card_holder_door_number" : args.card_holder_door_number,
            "security_code" : args.security_code,
            "card_holder_identification" : {
               "type" : args.type,
               "number" : args.number
            },
            "fraud_detection": {
                "device_unique_identifier": args.fraud_detection_device_unique_identifier
                }
        },
        
        headers: {
            apikey: args.apiKey,
            'Content-Type': "application/json"                 
        }
     };

    client.post(constants.ENDPOINT_DEVELOPER + "/tokens", args, function (data, response) {

        ret = data;
        //console.log(data);
        if (!data.hasOwnProperty('status')) {

            data.getErrorType = function () {
                return this.error_type;
            };
            data.getValidationErrors = function () {
                return this.validation_errors;
            };
            err = data
            ret = "Ha ocurrido un error.";
        }else{
            err = "no se detectaron errores en la petición.";
        }
        
        callback(ret, err);
    });
}
}