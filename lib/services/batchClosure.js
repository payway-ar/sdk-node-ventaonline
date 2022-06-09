var Client = require('node-rest-client').Client;
var constants = require('../utils/constants');

module.exports = {

    batchClosure : (endpoint, args, callback) => {
        client = new Client();

        args = {
            data:{
                "username": args.username,
                "site_id" : args.site_id,
                "payment_method_id" : args.payment_method_id
            },
            headers: {
                "apikey": constants.PRIVATE_API_KEY,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        }

        client.post(endpoint + "/batchclosure", args, (data,response) => {
            data.getBatchId = () =>{
                return this.batch_id;
            };
            
            data.getFileName = () =>{
                return this.file_name;
            };

            data.getErrors = () =>{
                return this.errors;
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



    }
}