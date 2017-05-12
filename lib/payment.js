var Promise = require('promise');

module.exports = {
    payment: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.payment(args, function(result, err) {
                resolve(result, err)
            });
        })
    }
}
