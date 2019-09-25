var Promise = require('promise');

module.exports = {
    tokens: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.tokens(args, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
