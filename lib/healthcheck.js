var Promise = require('promise');

module.exports = {
    healthcheck: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.healthcheck(args, function(result, err) {
                resolve(result)
            });
        })
    }
}
