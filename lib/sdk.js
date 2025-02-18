const payments = require('../lib/services/payments');
const batchClosure = require('../lib/services/batchClosure');
const refund = require('../lib/services/refunds');
const tokens = require('../lib/services/tokens');
const internalTokens = require('../lib/services/internalTokens');
const cryptogramPayment = require('./services/transactionData');
const checkoutLink = require('../lib/services/checkout');
const cardToken = require('../lib/services/deleteCardToken')
const logger = require('../lib/utils/logger')

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

module.exports = {
    sdk: function (environment, publicKeyParam, privateKeyParam, grouper, developer, xConsumer = "") {
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

        logger.info(`Incomming request - Environment: ${environment} - Grouper: ${grouper} - Developer: ${developer}` );

        this.getAllPayments = (args, offset, pageSize, siteOperationId, merchantId, callback) => {
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

        this.refund = (id, callback) => {
            try {
                refund.refund(endpointV2, privateKey, id, callback, grouper, developer)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.partialRefund = (args, id, callback) => {
            try {
                refund.partialRefund(endpointV2, privateKey, args, id, callback, grouper, developer)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.deleteRefund = (args, paymentId, refundId, callback) => {
            try {
                refund.deleteRefund(endpointV2, privateKey, args, paymentId, refundId, callback, grouper, developer)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.deletePartialRefund = (args, paymentId, callback) => {
            try {
                refund.deletePartialRefund(endpointV2, privateKey, args, paymentId, callback, grouper, developer)
            } catch (err) {
                throw new Error(err);
            }
        }

        this.deleteCardToken = (args, tokenizedCard, callback) => {
            try {
                cardToken.deleteCardToken(endpointV2, privateKey, args, tokenizedCard, callback, grouper, developer)
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
