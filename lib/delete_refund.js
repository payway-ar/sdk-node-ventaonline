var Promise = require('promise');

module.exports = {
    deleteRefund: function(sdk, paymentId, refund_id, args) {
        return new Promise(function(resolve, reject) {
            sdk.deleteRefund(args, paymentId, refund_id, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
