var Promise = require('promise');

module.exports = {
    batchClosure: (sdk, args) => {
        return new Promise((resolve, reject) => {
            sdk.batchClosure(endpoint, privateKey, args,
               (result, err) => {
                    resolve(result, err)
                });
        }).catch((err) => {
            throw new Error(err)
        });
    }
}
