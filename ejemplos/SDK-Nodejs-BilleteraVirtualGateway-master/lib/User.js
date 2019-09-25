/*
 * Define User Object-model
 */
var d = new Date();

function User(mail, pass , config){
	this.endpoint = config.endpoint;
	this.mail = mail;
	this.pass = pass;
	this.merchantId ='';
	this.apiKey ='';

    this.getCredentials = function(callback) {

        var Client = require('node-rest-client').Client;
        client = new Client();
        // set content-type header and data as json in args parameter
        var args = {
            data: {
                "USUARIO": this.mail,
                "CLAVE": this.pass
            },
            headers: {
                "Content-Type": "application/json"
            }
        };
        var err = '';
        var req = client.post(this.endpoint, args, function(data, response) {
            // parsed response body as js object
            if (Buffer.isBuffer(data)) {
                data = JSON.parse(data.toString('utf8'));
            }
            if (data.Credentials.resultado.codigoResultado == 0) {
                this.merchantId = data.Credentials.merchantId;
                this.apiKey = data.Credentials.APIKey;
            } else {
                this.merchantId = '';
                this.apiKey = '';
                err = d.toISOString() + '- ERROR : ' + data.Credentials.resultado.codigoResultado + ', message: ' + data.Credentials.resultado.mensajeResultado;
            }
            var ret = {
                'merchantId': this.merchantId,
                'apiKey': this.apiKey
            };

            callback(ret, err);
        });
    }

}

exports.Create = User;
