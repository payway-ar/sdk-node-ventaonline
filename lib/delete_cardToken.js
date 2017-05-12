var Promise = require('promise');

module.exports = {
    deleteCardToken: function(sdk, card_number, args) {
        return new Promise(function(resolve, reject) {
            sdk.deleteCardToken(args, card_number, function(result, err) {
                resolve(result, err)
            });
        });
    }
}
