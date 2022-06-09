// "use strict";

// module.exports = require('./lib/sdk');
var sdkModulo = require('./lib/sdk');
var constants = require('./lib/utils/constants')
var refundMod = require('./lib/requests/refundRequests');
var paymentMod = require('./lib/requests/paymentsRequests');
// SE INSTANCIA SDK DECIDIR 2
var sdk = new sdkModulo.sdk('developer', constants.PUBLIC_API_KEY, constants.PRIVATE_API_KEY);
console.log("hola mundo");
// exampleGetAllPayments(sdk);
//exampleRefund(sdk);
//examplePartialRefund(sdk);

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
        paymentId = 41359688;
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
        paymentId = 41359719;
        amount = 300;
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
    
