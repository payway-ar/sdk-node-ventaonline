// "use strict";

// module.exports = require('./lib/sdk');
var sdkModulo = require('./lib/sdk');
var constants = require('./lib/utils/constants')
var refundMod = require('./lib/requests/refundRequests');
var paymentMod = require('./lib/requests/paymentsRequests');
var tokensMod = require('./lib/requests/tokensRequests');
// SE INSTANCIA SDK DECIDIR 2
var sdk = new sdkModulo.sdk('developer', constants.PUBLIC_API_KEY, constants.PRIVATE_API_KEY);
console.log("hola mundo");
//exampleGetAllPayments(sdk);
//exampleRefund(sdk);
//examplePartialRefund(sdk);
//exampleTokens(sdk);

function exampleGetAllPayments(sdk) {
    var args = {
        data: {

        },
        headers: {
            "apikey": constants.PRIVATE_API_KEY,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    };
    offset = '0';
    pageSize = '50';
    siteOperationId = '';
    merchantId = '';
    console.log("antes de ir a all payments desde el index.js");
    console.log(paymentMod)
    paymentMod.getAllPayments(sdk, args).then(function(resp) {
        console.log("-----------------------------------------");
        console.log("infoPayments:");
        console.log(resp);
        console.log("-----------------------------------------");
        console.log("infoPayments error:");
        console.log(err);
        console.log("-------------------***-------------------");
    });

};
function exampleRefund(sdk){
    //SE HACE UN PAGO PARA PODER REALIZAR LA DEVOLUCIÓN
        paymentId = 41359853;
        var args = {
            data: {
    
            },
            headers: {
                "apikey": constants.PRIVATE_API_KEY,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        };
        setTimeout(function() {
             refundMod.refund(sdk, paymentId, args).then(function(resp) {
                console.log("")
                console.log("")
                console.log("Reintegro monto total de la transacción")
                console.log("")
                console.log("")
                console.log("                  REFUND                 ");
                console.log("-----------------------------------------");
                console.log("refund result:");
                console.log(resp);
                console.log("-----------------------------------------");
                console.log("refund error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        }, 2000);
};

function examplePartialRefund(sdk){
    //SE HACE UN PAGO PARA PODER REALIZAR LA DEVOLUCIÓN
        paymentId = 41359854;
        amount = 1000;
        var args = {
            data: {
                amount: amount
            },
            headers: {
                "apikey": constants.PRIVATE_API_KEY,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        };
        setTimeout(function() {
             refundMod.partialRefund(sdk, paymentId, args).then(function(resp) {
                console.log("")
                console.log("")
                console.log("Reintegro monto total de la transacción")
                console.log("")
                console.log("")
                console.log("                PARTIAL  REFUND                 ");
                console.log("-----------------------------------------");
                console.log("refund result:");
                console.log(resp);
                console.log("-----------------------------------------");
                console.log("refund error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        }, 2000);
};

function exampleTokens(sdk) { //*************************{
        //SE OBTIENE UN TOKEN DE PAGO
            var date = new Date().getTime();
            console.log('traza 1');
            args = {
                "card_number" : "5270610000001584",
                "card_expiration_month" : "11",
                "card_expiration_year" : "23", 
                "card_holder_name" : "Andrea",
                "card_holder_birthday" : "24071990",
                "card_holder_door_number" : 505,
                "security_code" : "123",
                "card_holder_identification" : {
                   "type" : "dni",
                   "number" : "35107505"
                },
                "fraud_detection_device_unique_identifier": "12345",
                "apiKey": "YKcWXjI2aoSnp60urwLd6TbLYNuybcWC"
            };



            // send_to_cs = TRUE O FALSE PARA ENVIAR PARAMETROS CS

            //Se envian sdk y parametros al modulos de validate que realizará el pago
            tokensMod.tokens(sdk, args).then(function(result) {
                console.log("-----------------------------------------")
                console.log("Tokens")
                console.log(result);
                console.log("-------------------***-------------------");
            })
}
    
