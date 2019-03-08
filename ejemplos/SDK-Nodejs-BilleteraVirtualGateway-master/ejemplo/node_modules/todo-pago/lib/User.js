/*
 * Define User Object-model
 */
var d = new Date();

function User(mail, pass, config) {
    this.endpoint = config.endpoint;
    this.mail = mail;
    this.pass = pass;
    this.merchantId = '';
    this.apiKey = '';

    this.getCredentials = function(callback) {
        // aca me conexto a la api que trae las cosas
        console.log(d.toISOString() + " - Ingreso a getCredentials: mail: " + mail + ", pass: " + pass);
        console.log(this.endpoint);

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
            console.log(data);
            if (data.Credentials.resultado.codigoResultado == 0) {
                //console.log("success...");
                this.merchantId = data.Credentials.merchantId;
                this.apiKey = data.Credentials.APIKey;
                //console.log(this)
            } else {
                this.merchantId = '';
                this.apiKey = '';
                err = d.toISOString() + '- ERROR : ' + data.Credentials.resultado.codigoResultado + ', message: ' + data.Credentials.resultado.mensajeResultado;
                console.log(err);
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
