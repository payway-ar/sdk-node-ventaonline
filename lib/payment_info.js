var Promise = require('promise');

module.exports = {
    paymentInfo: function(sdk, paymentId, args) {
        return new Promise(function(resolve, reject) {
            sdk.paymentInfo(args, paymentId, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
