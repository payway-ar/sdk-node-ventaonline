var Promise = require('promise');

module.exports = {
    partialRefund: (sdk, paymentId, args)=> {
        return new Promise((resolve, reject)=> {
            sdk.partialRefund(args, paymentId, (result, err)=> {
                resolve(result, err)
            });
        });
    }
}