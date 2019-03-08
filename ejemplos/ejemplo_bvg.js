var express = require('express');
var http = require('http');
const sqlite3 = require('sqlite3').verbose();
var app = express();
var path = require('path');
var Client = require('node-rest-client').Client;
var Promise = require('promise');
var TokenDataModulo = require('../lib/token_data.js');
var PaymentDataModulo = require('../lib/payment_data.js');
var querystring = require('querystring');
var sdkModulo = require('../lib/sdk');
var bsa = require('./SDK-Nodejs-BilleteraVirtualGateway-master/lib/BSA/bsa.js'); // Obtengo las funciones discover y transaction


app.set('view engine', 'ejs');

app.use(express.static(__dirname));


let db = new sqlite3.Database('./ejemplobvg.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});


app.get('/data', function(req, res) {
    res.render('./ejemplo_bvg.ejs', {
        seccion: "data",
    });
});

app.post('/data_db', function(req, res) {

    req.on('data', function(datosparciales) {
        var stringDatos;
        stringDatos += datosparciales;
        //console.log(stringDatos);
        var data = querystring.parse(stringDatos);
        console.log(JSON.stringify(data));

        db.all(`INSERT INTO transaccion 
            (data)
            VALUES
            ('`+ JSON.stringify(data) +`')`, (err, rows) => {
            if (err) {
              console.error(err.message);
            }
        });          

        res.render('./success.ejs');               

    });
});


app.get('/transaction', function(req, res) {
    console.log('transaction');
    console.log(req.query.ord);

    db.get(`SELECT * FROM transaccion WHERE id=`+req.query.ord, (err, rows) => {
        if (err) {
          console.error(err.message);
        }
        console.log(rows);
        var data=JSON.parse(rows.data);
        console.log(data);
        console.log('mercant: ' + data.merchant);

    //Convierte a int todos los elementos de Availablepaymentmethods
    var arrAvailablepaymentmethods=[];
    arrAvailablepaymentmethods = data.availablepaymentmethods.split(',');
    var availablepaymentmethodsInt = arrAvailablepaymentmethods.map(function(x) {
       return parseInt(x);
    });

    //Convierte a int todos los elementos de AvailableBanks
    var arrAvailableBanks=[];
    arrAvailableBanks = data.availablebanks.split(',');
    var availableBanksInt=arrAvailableBanks.map(function(x) {
       return parseInt(x);
    });

    generalData = {
        "merchant": data.merchant,
        "security": data.security,
        "operationDatetime": "20170302155613",
        "remoteIpAddress": "192.168.11.87",
        "channel": data.channel
    };

    operationData = {
        "operationType": data.operationtype,
        "operationID": req.query.ord,
        "currencyCode": data.currency,
        "concept": data.concept,
        "amount": data.amount,
        "availablePaymentMethods": availablepaymentmethodsInt,
        "availableBanks": availableBanksInt,
        "buyerPreselection": {
            "paymentMethodId": parseInt(data.buyerpreselectionmp),
            "bankId": parseInt(data.buyerpreselectionbank)
        }
    };

    technicalData = {
        "sdk": "NodeJS",
        'sdkversion': '1.3.1',
        'lenguageversion': '1.8',
        'pluginversion': '2.1',
        'ecommercename': 'DH-gate',
        'ecommerceversion': '3.1',
        'cmsversion': '2.4'
    };


    bsa.getTransaction(generalData, operationData, technicalData, function(result, err) {
        console.log("-------------------***-------------------");
        console.log("getTransaction:");
        console.log(result);
        db.all(`UPDATE transaccion 
            SET transactionresponse='`+ JSON.stringify(result) +`'
            WHERE id='`+ req.query.ord +`'`, (err, rows) => {
            if (err) {
              console.error(err.message);
            }
        });         
        console.log('error: ');
        console.log(err.toString('utf8'));
        console.log("-------------------***-------------------");
    });        
    }); 




});    



app.get('/', function(req, res) {
    db.all(`SELECT * FROM transaccion`, (err, rows) => {
        if (err) {
          console.error(err.message);
        }

        res.render('./ejemplo_bvg.ejs', {
            rows: rows,
            seccion: "main"
        }); 
    });    
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
