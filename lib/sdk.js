const payments = require('../lib/services/payments');
const batchClosure = require('../lib/services/batchClosure');
const refund = require('../lib/services/refunds');
const tokens = require('../lib/services/tokens');
function decimalToInteger(number){
    return (number % 1 != 0) ? number *= 100 : number;
}

module.exports = {
    sdk: function (environment, publicKey, privateKey, grouper, developer) {
        var decidirVersion="1.3.2"
        var publicKey = publicKey;
        var privateKey = privateKey;
        var endpoint;
        if (environment == 'developer') {
            endpoint = 'https://developers.decidir.com/api/v2'
        } else if (environment == 'production') {
            endpoint = 'https://live.decidir.com/api/v2'
        }else if (environment == 'qa'){
            endpoint = 'https://qa.decidir.com/api/v2'
        }

        console.log(endpoint)

        this.getAllPayments = (args, offset, pageSize, siteOperationId, merchantId, callback) => {
            console.log("de la sdk a get all payments")
            try {
                payments.getAllPayments(args, offset, pageSize, siteOperationId, merchantId, callback)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.batchClosure = (endpoint, args, callback) => {
            try {
                batchClosure.batchClosure(endpoint, args, callback);
            }catch(err){
                throw new Error(err);
            }
        }

        this.refund = (args, id, callback) =>{
            try{
                refund.refund( args,id,callback)
            }catch(err){
                throw new Error(err);
            }
            
        }

        this.partialRefund = (args, id, callback) =>{
            try{
                refund.partialRefund( args,id,callback)
            }catch(err){
                throw new Error(err);
            }
        } 
        
        this.partialRefund = (args, id, callback) =>{
            try{
                refund.partialRefund(endpoint, args,id,callback)
            }catch(err){
                throw new Error(err);
            }
        }
        
        this.tokens = (args, callback) =>{
            try{
                tokens.tokens(endpoint,publicKey,args,callback,grouper, developer)
            }catch(err){
                throw new Error(err);
            }            
        }
        
        this.payment = (args, callback) =>{
            try{
                payments.payment(endpoint,privateKey,args,callback, grouper, developer)
            }catch(err){
                throw new Error(err);
            }            
        }
    }
}
