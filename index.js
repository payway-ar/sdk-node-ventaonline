// "use strict";

// module.exports = require('./lib/sdk');
var sdkModulo = require('./lib/sdk');
var constants = require('./lib/utils/constants')

var paymentMod = require('./lib/requests/paymentsRequests');
// SE INSTANCIA SDK DECIDIR 2
var sdk = new sdkModulo.sdk('developer', constants.PUBLIC_API_KEY, constants.PRIVATE_API_KEY);
console.log("hola mundo");
exampleGetAllPayments(sdk);

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