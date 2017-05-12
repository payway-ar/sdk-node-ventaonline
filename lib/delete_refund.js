var Promise = require('promise');

module.exports = {
    deleteRefund: function(sdk, paymentId, args) {
        return new Promise(function(resolve, reject) {
            sdk.deleteRefund(args, paymentId, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
