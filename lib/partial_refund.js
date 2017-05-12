var Promise = require('promise');

module.exports = {
    partialRefund: function(sdk, paymentId, args) {
        return new Promise(function(resolve, reject) {
            sdk.partialRefund(args, paymentId, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
