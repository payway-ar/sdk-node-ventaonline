var Promise = require('promise');

module.exports = {
    token: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.token(args, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
