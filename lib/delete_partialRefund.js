var Promise = require('promise');

module.exports = {
    deletePartialRefund: function(sdk, paymentId, args) {
        return new Promise(function(resolve, reject) {
            sdk.deletePartialRefund(args, paymentId, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
