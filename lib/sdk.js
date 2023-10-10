const payments = require('../lib/services/payments');
const batchClosure = require('../lib/services/batchClosure');
const refund = require('../lib/services/refunds');
const tokens = require('../lib/services/tokens');
const internalTokens = require('../lib/services/internalTokens');
const cryptogramPayment = require('./services/transactionData');
const threeDSinstruction = require('../lib/services/threeDS');
const checkoutLink = require('../lib/services/checkout');

const {
    ENDPOINT_DEV_V1,
    ENDPOINT_QA_V1,
    ENDPOINT_PRD_V1,
    ENDPOINT_DEV_V2,
    ENDPOINT_QA_V2,
    ENDPOINT_PRD_V2,
    ENDPOINT_CHECKOUT_DEV_V2,
    ENDPOINT_CHECKOUT_QA_V2,
    ENDPOINT_CHECKOUT_PROD_V2
} = require("./utils/constants");
const checkout = require('../lib/services/checkout');

function decimalToInteger (number) {
    return (number % 1 != 0) ? number *= 100 : number;
}

module.exports = {
    sdk: function (environment, publicKeyParam, privateKeyParam, grouper, developer, xConsumer = "") {
        const decidirVersion = "1.3.2"
        const publicKey = publicKeyParam;
        const privateKey = privateKeyParam;
        const consumer = xConsumer;
        const endpointV2 = {
            'developer': ENDPOINT_DEV_V2,
            'production': ENDPOINT_PRD_V2,
            'qa': ENDPOINT_QA_V2
        }[environment];
        const endpointV1 = {
            'developer': ENDPOINT_DEV_V1,
            'production': ENDPOINT_PRD_V1,
            'qa': ENDPOINT_QA_V1
        }[environment];
        
        const endpointCheckoutV2 = {
            'developer': ENDPOINT_CHECKOUT_DEV_V2,
            'production': ENDPOINT_CHECKOUT_PROD_V2,
            'qa': ENDPOINT_CHECKOUT_QA_V2
        }[environment];

        console.log(endpointV1);
        console.log(endpointV2);

        this.getAllPayments = (args, offset, pageSize, siteOperationId, merchantId, callback) => {
            console.log("de la sdk a get all payments")
            try {
                payments.getAllPayments(args, offset, pageSize, siteOperationId, merchantId, callback)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.batchClosure = (endpointV2, args, callback) => {
            try {
                batchClosure.batchClosure(endpointV2, args, callback);
            } catch (err) {
                throw new Error(err);
            }
        }

        this.refund = (args, id, callback) => {
            try {
                refund.refund(args, id, callback)
            } catch (err) {
                throw new Error(err);
            }

        }

        this.partialRefund = (args, id, callback) => {
            try {
                refund.partialRefund(args, id, callback)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.partialRefund = (args, id, callback) => {
            try {
                refund.partialRefund(endpointV2, args, id, callback)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.tokens = (args, callback) => {
            try {
                tokens.tokens(endpointV2, publicKey, args, callback, grouper, developer)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.internaltokens = (args, callback) => {
            try {
                internalTokens.internalTokens(endpointV1, publicKey, args, callback, grouper, developer);
            } catch (err) {
                throw new Error(err);
            }
        };

        this.payment = (args, callback) => {
            try {
                payments.payment(endpointV2, privateKey, args, callback, grouper, developer)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.cryptogramPayment = (args, callback) => {
            try {
                cryptogramPayment.cryptogramPayment(endpointV1, privateKey, args, callback, grouper, developer);
            } catch (err) {
                throw new Error(err);
            }
        };

        this.tokenizedPCIPayment = (args, callback) => {
            try {
                payments.tokenizedPCIPayment(endpointV2, privateKey, args, callback, grouper, developer)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.threeDSinstruction = (args,callback) => {
            try {
                payments.threeDSchallenge(endpointV2, privateKey, args, callback, grouper, developer, consumer)
            } catch (error) {
               new Error(error) 
            }
        }

        this.checkout = (args, callback) =>{
            try {
                checkoutLink.checkoutHash(endpointCheckoutV2,privateKey,args, callback, grouper, developer)
            } catch (error) {
                new Error(error)
            }
        }

        this.confirmPayment = (id, args, callback) => {
            try {
                payments.confirmPayment(id, endpointV2, privateKey, args, callback, grouper, developer)
            } catch (error) {
                new Error(error)
            }
        }
    }
}
