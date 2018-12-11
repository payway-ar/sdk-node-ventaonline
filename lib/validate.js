var Promise = require('promise');

module.exports = {
    validate: function(sdk, paymentId, args) {
        return new Promise(function(resolve, reject) {
            sdk.validate(args, paymentId, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
