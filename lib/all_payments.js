var Promise = require('promise');

module.exports = {
    getAllPayments: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.getAllPayments(args, offset, pageSize, merchantId, merchantId, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
