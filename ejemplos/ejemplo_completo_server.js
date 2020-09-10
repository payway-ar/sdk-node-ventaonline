var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var Client = require('node-rest-client').Client;
var Promise = require('promise');
var TokenDataModulo = require('../lib/token_data.js');
var PaymentDataModulo = require('../lib/payment_data.js');
var querystring = require('querystring');
var sdkModulo = require('../lib/sdk');
const { PUBLIC_API_KEY, ENDPOINT_DEVELOPER, PRIVATE_API_KEY } = require('./constants.js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'

function exampleGetToken() {
    return new Promise(function(resolve, reject) {
        args = {
            card_number: '4507990000004905',
            card_expiration_month: '08',
            card_expiration_year: "18",
            security_code: "775",
            card_holder_name: "John Doe",
            type: "dni",
            number: "25123456",
            apiKey: PUBLIC_API_KEY,
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }

        var tokenData = new TokenDataModulo.tokenData(args);
        var args = tokenData.getJSON();
        var client = new Client();

        client.post(ENDPOINT_DEVELOPER + "/tokens", args, function(data, response) {
            resolve(data.id);

            if (Buffer.isBuffer(data)) {
                data = JSON.parse(data.toString('utf8'));
            }
        });
    });
}

app.set('view engine', 'ejs');

app.use(express.static(__dirname));

app.get('/', function(req, res) {
    exampleGetToken().then(function(token) {
        res.render('./ejemplo_form.ejs', {
            token: token,
            partialRefund: '',
            totalRefund: '',
            paymentId: '',
            publicApiKey: PUBLIC_API_KEY,
            privateApiKey: PRIVATE_API_KEY
        });
    })
});


app.get('/partialRefund', function(req, res) {
    exampleGetToken().then(function(token) {
        res.render('./ejemplo_form.ejs', {
            token: token,
            partialRefund: 'false',
            totalRefund: 'false',
            paymentId: 'false',
            cardToken: 'false'
        });
    });
});
app.get('/totalRefund', function(req, res) {
    exampleGetToken().then(function(token) {
        res.render('./ejemplo_form.ejs', {
            token: token,
            partialRefund: 'false',
            totalRefund: 'false',
            paymentId: 'false',
            tokenCard: 'false'
        });
    });
})
app.post('/requestToken', function(req, res) {
    var info = '';
    var formulario;
    req.on('data', function(datosparciales) {
        info += datosparciales;
        formulario = querystring.parse(info);
        args = {
            card_number: formulario.card_number,
            card_expiration_month: formulario.card_expiration_month,
            card_expiration_year: formulario.card_expiration_year,
            security_code: formulario.security_code,
            card_holder_name: formulario.card_holder_name,
            type: formulario.type,
            number: formulario.number,
            apiKey: formulario.apiKey,
            'Content-Type': formulario.contentType,
            'Cache-Control': formulario.cacheControl
        }
        var tokenData = new TokenDataModulo.tokenData(args);
        var args = tokenData.getJSON();
        var client = new Client();

        client.post(ENDPOINT_DEVELOPER + "/tokens", args, function(data, response) {
            console.log(data)

            res.send(data)
            res.end()
            if (Buffer.isBuffer(data)) {
                data = JSON.parse(data.toString('utf8'));
                //(response);
            }
        });
    })
})
app.post('/requestTokenized', function(req, res) {
    var info = '';
    var formulario;
    req.on('data', function(datosparciales) {
        info += datosparciales;
        formulario = querystring.parse(info);
        args = {
            token: formulario.cardToken,
            security_code: formulario.security_code,
            apiKey: formulario.apiKey,
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }
        var tokenData = new TokenDataModulo.tokenData(args);
        var args = tokenData.getJSON();
        var client = new Client();

        client.post(ENDPOINT_DEVELOPER + "/tokens", args, function(data, response) {
            console.log(data)

            res.send(data)
            res.end()
            if (Buffer.isBuffer(data)) {
                data = JSON.parse(data.toString('utf8'));
                //(response);
            }
        });
    })
})

function exampleGetCardToken(user_id, sdk) {

    return new Promise(function(resolve, reject) {

        var args = {
            data: {

            },
            headers: {
                "apikey": PRIVATE_API_KEY,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        };
        sdk.cardTokens(args, user_id, function(result, err) {
            resolve(result.tokens[0].token)
        })
    })
}
app.post('/paymentRequest', function(req, res) {
    var info = '';
    req.on('data', function(datosparciales) {

        info += datosparciales;
        var formulario = querystring.parse(info);
        var date = new Date().getTime();
        var paymentData = new PaymentDataModulo.paymentData(formulario.transactionId, formulario.token, 'user_id', parseInt(formulario.payment_method_id), formulario.bin, parseInt(formulario.amount), formulario.currency, parseInt(formulario.installments), formulario.description, formulario.paymentType, [], formulario.apiKeyHidden, formulario.contentTypeHidden);

        args = {
            site_transaction_id: formulario.transactionId,
            token: formulario.token,
            user_id: formulario.user_id,
            payment_method_id: parseInt(formulario.payment_method_id),
            bin: formulario.bin,
            amount: parseInt(formulario.amount),
            currency: formulario.currency,
            installments: parseInt(formulario.installments),
            description: formulario.description,
            payment_type: formulario.paymentType,
            sub_payments: [],
            apiKey: formulario.apiKeyHidden,
            'Content-Type': 'application/json'
        };
        console.log(args)
        var sdk = new sdkModulo.sdk('developer', PUBLIC_API_KEY, args.apiKey);

        var paymentData = new PaymentDataModulo.paymentData(args);
        var args = paymentData.getJSON();

        //exampleGetCardToken(args.data.user_id, sdk).then(function(key) {
            sdk.payment(args, function(result, err) {
                if(!result.hasOwnProperty('status')){
                    console.log(err.getValidationErrors())
                    result = err;
                }

        //        result.cardToken = key;
                res.send(result);
            });
        //})
    })
});

app.put('/confirmPayment', function(req, res) {

    var stringDatos = '';
    var paymentId = '';
    var statusRefund = '';
    req.on('data', function(datosparciales) {
        stringDatos += datosparciales;
        var data = querystring.parse(stringDatos);
        paymentId = data.paymentId;
        console.log(data)
        var args = {
            data: {
                "amount": parseInt(data.amount)
            },
            headers: {
                "apikey": data.apiKeyHidden,
                "Content-Type": "application/json",
                "Cache-Control": ""
            }
        };
        var sdk = new sdkModulo.sdk('developer', PUBLIC_API_KEY, data.apiKeyHidden);

        sdk.confirmPayment(args, paymentId, function(result, err) {
            statusRefund = result.status;
            if (statusRefund == undefined) {
                statusRefund = 'error'
            }
            res.send(result)

        });
    })
})

app.post('/partialRefund', function(req, res) {

    var stringDatos = '';
    var paymentId = '';
    var statusRefund = '';
    req.on('data', function(datosparciales) {
        stringDatos += datosparciales;
        var data = querystring.parse(stringDatos);
        paymentId = data.paymentId;
        cardToken = data.cardToken;
        console.log(data)
        var args = {
            data: {
                "amount": parseInt(data.amount)
            },
            headers: {
                "apikey": data.apiKeyHidden,
                "Content-Type": "application/json",
                "Cache-Control": ""
            }
        };
        var sdk = new sdkModulo.sdk('developer', PUBLIC_API_KEY, data.apiKeyHidden);

        sdk.partialRefund(args, paymentId, function(result, err) {
            statusRefund = result.status;
            if (statusRefund == undefined) {
                statusRefund = 'error'
            }
            res.send(result)

        });
    })
})
app.post('/totalRefund', function(req, res) {

    var stringDatos = '';
    var paymentId = '';
    var statusRefund = '';
    req.on('data', function(datosparciales) {
        stringDatos += datosparciales;
        var data = querystring.parse(stringDatos);
        paymentId = data.paymentId;
        var args = {
            data: {

            },
            headers: {
                "apikey": data.apiKeyHidden,
                "Content-Type": "application/json",
                "Cache-Control": ""
            }
        };
        var sdk = new sdkModulo.sdk('developer', PUBLIC_API_KEY, data.apiKeyHidden);

        sdk.refund(args, paymentId, function(result, err) {
            statusRefund = result.status;
            if (statusRefund == undefined) {
                statusRefund = 'error'
            }
            res.send(result)
        })
    })
})
app.post('/', function(req, res) {

});
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


http.createServer(app).listen('4000', function() { //Creacion del servidor web
    console.log('Express server listening on port ' + '4000');
});
