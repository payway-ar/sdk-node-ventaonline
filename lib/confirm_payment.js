var Promise = require('promise');

module.exports = {
    confirmPayment: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.confirmPayment(args, function(result, err) {
                resolve(result, err)
            });
        })
    }
}
