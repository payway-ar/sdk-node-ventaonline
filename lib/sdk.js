var Client = require('node-rest-client').Client;
const payments = require('../lib/services/payments');
const batchClosure = require('../lib/services/batchClosure');
const refund = require('../lib/services/refunds');
const tokens = require('../lib/services/tokens');
function decimalToInteger(number){
    return (number % 1 != 0) ? number *= 100 : number;
}

module.exports = {
    sdk: function (environment, publicKey, privateKey) {
        var decidirVersion="1.3.2"
        var publicKey = publicKey;
        var privateKey = privateKey;
        var endpoint;
        if (environment == 'developer') {
            endpoint = 'https://qa.decidir.com/api/v2'
        } else if (environment == 'production') {
            endpoint = 'https://live.decidir.com/api/v2'
        }

        console.log(endpoint)

        this.getAllPayments = (args, offset, pageSize, siteOperationId, merchantId, callback) => {
            console.log("de la sdk a get all payments")
            payments.getAllPayments(args, offset, pageSize, siteOperationId, merchantId, callback)
        }

        this.batchClosure = (endpoint, args, callback) => {
            batchClosure.batchClosure(endpoint, args, callback);
       
        }
        this.refund = (args, id, callback) =>{
            console.log("de la sdk a refunds")
            refund.refund( args,id,callback)
        }
         this.partialRefund = (args, id, callback) =>{
            console.log("de la sdk a PartialRefunds")
            refund.partialRefund( args,id,callback)
        }
        this.tokens = (args, callback) =>{
            console.log("de la sdk a tokens")
            tokens.tokens(args,callback)
        }
    }
}
