var express = require('express');
var http = require('http');
const sqlite3 = require('sqlite3').verbose();
var app = express();
var path = require('path');
var Client = require('node-rest-client').Client;
var Promise = require('promise');
var TokenDataModulo = require('../lib/token_data.js');
var PaymentDataModulo = require('../lib/payment_data.js');
var paymentInfoMod = require('../lib/payment_info');
var querystring = require('querystring');
var sdkModulo = require('../lib/sdk');
var bsa = require('./SDK-Nodejs-BilleteraVirtualGateway-master/lib/BSA/bsa.js'); // Obtengo las funciones discover y transaction
const { PUBLIC_API_KEY, PRIVATE_API_KEY } = require('./constants.js');

var sdk = new sdkModulo.sdk('developer', PUBLIC_API_KEY, PRIVATE_API_KEY);


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

            res.render('./success.ejs');
        });         
        console.log('error: ');
        console.log(err.toString('utf8'));
        console.log("-------------------***-------------------");
    });        
    }); 

});    




app.get('/pago_tp', function(req, res) {
    console.log('transaction');
    console.log(req.query.ord);

    db.get(`SELECT * FROM transaccion WHERE id=`+req.query.ord, (err, row) => {
        if (err) {
          console.error(err.message);
        }          
        var dataTransaction=JSON.parse(row.transactionresponse);
        console.log(dataTransaction);
        console.log(dataTransaction.transactionresponse);

        var dataGeneral = JSON.parse(row.data);

        if(row.ambiente=="dev"){
            var endpoint="https://portalqa.visa2.com.ar/resources/TPBSAForm.min.js";
        }else{
            var endpoint="https://forms.todopago.com.ar/resources/TPBSAForm.min.js";
        }
        
        res.render('./pago_tp.ejs', {
            endpoint: endpoint,
            operationid: req.query.ord,
            publicKey: dataTransaction.publicRequestKey,
            merchant: dataGeneral.merchant,
        });   
    });
});



app.get('/pago_tp_action', function(req, res) {
    if(req.query.success){
        var status = "ACEPTADO";
    }else{
        var status = "RECHAZADO";
    }

    db.all(`UPDATE transaccion 
        SET pagotpstatus='`+ status +`',
        pagotpresponse='`+ req.query.formresponse +`'
        WHERE id='`+ req.query.ord +`'`, (err, rows) => {
        if (err) {
          console.error(err.message);
        }

        res.render('./success.ejs');
    }); 
});

app.get('/pago_decidir', function(req, res) {
    db.get(`SELECT * FROM transaccion WHERE id=`+req.query.ord, (err, row) => {
        if (err) {
          console.error(err.message);
        }          
        var dataTransaction=JSON.parse(row.transactionresponse);
        var dataGeneral = JSON.parse(row.data);
        var dataTpResponse = JSON.parse(row.pagotpresponse);

        if(dataTpResponse.TokenizationFlag == "true"){
            var flag_token = "1";
        }else{
            var flag_token = "0";
        }

        if(dataTpResponse.SecurityCodeCheck == "true"){
            var flag_code_check = "1";
        }else{
            var flag_code_check = "0";
        }

        
        var args = {
            data: {
               "public_token":dataTpResponse.Token,
               "volatile_encrypted_data":dataTpResponse.VOLATILE_ENCRYPTED_DATA,
               "public_request_key":dataTransaction.publicRequestKey,
               "issue_date":dataTpResponse.TokenDate,
               "flag_security_code":flag_code_check,
               "flag_tokenization":flag_token,
               "flag_selector_key":dataTpResponse.SelectorClaveFlag,
               "flag_pei":"1",
               "card_holder_name":dataTpResponse.DatosAdicionales.nombre,
               "card_number":"4507990000004905",
               "card_expiration_month":"08",
               "card_expiration_year":"19",
               "card_holder_identification":{
                  "type": dataTpResponse.DatosAdicionales.tipoDocumento,
                  "number": dataTpResponse.DatosAdicionales.numeroDocumento
               },
               "fraud_detection":{
                  "device_unique_identifier":"12345"
               }
            },
            headers: {
                apikey: dataGeneral.key_public,
                'Content-Type': 'application/json'
            }
        };
        
        /*
        var args = {
            data: {
               "public_token":96291105,
               "volatile_encrypted_data":"YRfrWggICAggsF0nR6ViuAgWsPr5ouR5knIbPtkN+yntd7G6FzN/Xb8zt6+QHnoxmpTraKphZVHvxA==",
               "public_request_key":"5516e585-c0b6-447c-bbb0-8ee1fa75d8ca",
               "issue_date":"20190108",
               "flag_security_code":"0",
               "flag_tokenization":"0",
               "flag_selector_key":"1",
               "flag_pei":"1",
               "card_holder_name":"Comprador",
               "card_number":"4507990000004905",
               "card_expiration_month":"08",
               "card_expiration_year":"19",
               "card_holder_identification":{
                  "type":"DNI",
                  "number":"33222444"
               },
               "fraud_detection":{
                  "device_unique_identifier":"12345"
               }
            },
            headers: {
                apikey: PUBLIC_API_KEY,
                'Content-Type': 'application/json'
            }
        };        
        */

        var client = new Client();

        client.post(ENDPOINT_DEVELOPER + "/tokens", args, function(data, response) {
            console.log(data);
            //var dataResponse = JSON.parse(data);

            dataPago = {
                "site_transaction_id": req.query.ord,
                "payment_mode": "bsa",
                "token": data.id,
                "customer": {"id": dataGeneral.user_id, "email": dataGeneral.user_mail},
                "payment_method_id": dataGeneral.decpaymentmethod,
                //"amount": str_replace(",",".",dataGeneral.amount),
                "amount": dataGeneral.amount.replace(",", "."),
                "bin": dataGeneral.bin,
                "currency": dataGeneral.currencydec,
                "installments": dataGeneral.cuotas,
                "description": "prueba",
                "payment_type": "single",
                "establishment_name": dataGeneral.establishment,
                "sub_payments": []
            }
            client.post(ENDPOINT_DEVELOPER + "/payments", args, function(data, response) {
                //resolve(data.id);
                console.log('data de pago::::');
                console.log(data);

                var execresponse;
                if(data.status=="approved" || 1==1){
                    var statusPago = "ACEPTADO";
                    var execresponse = `{
                        "id": `+ data.id + `,
                        "status":`+  data.status + `,
                        "ticket":`+  data.status_details.ticket + `,
                        "authorization":`+  data.status_details.card_authorization_code + `,
                        "amount":`+  data.currency + `,
                        "date":`+  data.date + `
                    }`;
                    
                                                  
                }
                else{
                    var statusPago="RECHAZADO";
                }


                db.all(`UPDATE transaccion 
                    SET pagodecresponse='`+ execresponse +`',
                    pagodecstatus='`+ statusPago +`'
                    WHERE id='`+ req.query.ord +`'`, (err, rows) => {
                    if (err) {
                      console.error(err.message);
                    }

                    res.render('./success.ejs');
                });                 
            });


        });

    });

    res.render('./success.ejs');

});



app.get('/push_notification', function(req, res) {
    db.get(`SELECT * FROM transaccion WHERE id=`+req.query.ord, (err, row) => {
        if (err) {
          console.error(err.message);
        }       
        var args = {
            data: {

            },
            headers: {
                "apikey": PRIVATE_API_KEY,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        };


        var dataTransaction=JSON.parse(row.transactionresponse);
        var dataGeneral = JSON.parse(row.data);
        var dataTpResponse = JSON.parse(row.pagotpresponse);
        var dataPagoDecidirResponse = JSON.parse(row.pagodecresponse);
        
        setTimeout(function() {
            var query = "?expand=card_data";

            var paymentInfo = new paymentInfoMod.paymentInfo(sdk, dataPagoDecidirResponse.id + query, args).then(function(resp) {

                var today = new Date();
                var minutes = today.getMinutes();
                var seconds = today.getSeconds();
                var hours = today.getHours();
                var mm = today.getMonth()+1; 
                var yyyy = today.getFullYear();
                var dd = today.getDate();

                if(dd<10) 
                {
                    dd='0'+dd;
                } 

                if(mm<10) 
                {
                    mm='0'+mm;
                }  
                               
                if(minutes<10) 
                {
                    minutes='0'+minutes;
                } 

                if(seconds<10) 
                {
                    seconds='0'+seconds;
                } 

                if(hours<10) 
                {
                    hours='0'+hours;
                } 

                console.log('año: ' + yyyy);


                var fulldate=""+yyyy+mm+dd+hours+minutes+seconds;
                console.log("fulldate: " + fulldate);
                //varfulldate="20190101010101";
                var ip = req.ip.split(':').pop();
                console.log(ip);

                var generalData = {
                    "merchant": parseInt(dataGeneral.merchant),
                    "security": dataGeneral.security,
                    "operationName": "Compra",
                    "publicRequestKey": dataTransaction.publicRequestKey,
                    "remoteIpAddress": ip
                    
                };
                


                var operationData = {
                    "resultCodeMedioPago": -1,
                    "resultCodeGateway": -1,
                    "idGateway": 8,
                    "resultMessage": dataPagoDecidirResponse.status,
                    "operationDatetime": fulldate, //fecha de operacion del transaction
                    "ticketNumber": dataPagoDecidirResponse.status_details.ticket,
                    "codigoAutorizacion": dataPagoDecidirResponse.status_details.card_authorization_code,
                    "currencyCode": dataGeneral.currency,
                    "operationID": dataGeneral.operacion,
                    "concept": "compra",
                    "amount": dataGeneral.amount,
                    "facilitiesPayment": "03"
                };


                var tokenizationData = {
                    "publicTokenizationField": dataTpResponse.Token,
                    "credentialMask": resp.card_data.card_number
                };


                console.log('antes de push notification');
                //pushNotification: function(generalData, operationData, tokenizationData, callback
                bsa.pushNotification(generalData, operationData, tokenizationData, function(result, err) {
                    console.log("-------------------***-------------------");
                    console.log(result);

                    if(result.statusCode=="-1"){
                        var pushstatus = "ACEPTADO";
                    }else{
                        var pushstatus = "RECHAZADO";
                    }

                    db.all(`UPDATE transaccion 
                        SET pushresponse='`+ result +`',
                        pushstatus='`+ pushstatus +`'
                        WHERE id='`+ req.query.ord +`'`, (err, rows) => {
                        if (err) {
                          console.error(err.message);
                        }

                        res.render('./success.ejs');
                    });                     
                    console.log("-------------------***-------------------");
                });

            });
        }, 2000);
            
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