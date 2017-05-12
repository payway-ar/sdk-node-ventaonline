var Promise = require('promise');

module.exports = {
    refund: function(sdk, paymentId, args) {
        return new Promise(function(resolve, reject) {
            sdk.refund(args, paymentId, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
