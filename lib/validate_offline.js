var Promise = require('promise');

module.exports = {
    validateOffline: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.validate2(args, function(result, err) {
                resolve(result, err)
            });
        });
    } 
}
