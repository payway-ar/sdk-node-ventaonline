var Promise = require('promise');

module.exports = {
    cardTokens: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.cardTokens(args, user_id, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
