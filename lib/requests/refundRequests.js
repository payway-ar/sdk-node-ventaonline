var Promise = require('promise');

module.exports = {
    refund: (sdk, paymentId, args) => {
        return new Promise((resolve, reject) => {
            sdk.refund(args, paymentId, (result, err)=> {
                resolve(result, err)
            }).catch((err) => {
                throw new Error(err)
            });
        });
    },
    partialRefund: (sdk, paymentId, args)=> {
        return new Promise((resolve, reject)=> {
            sdk.partialRefund(args, paymentId, (result, err)=> {
                resolve(result, err)
            })
        }).catch((err) => {
            throw new Error(err)
        });
    }
}
