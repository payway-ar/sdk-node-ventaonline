var Promise = require('promise');

module.exports = {
    tokens: (sdk, args)=> {
        return new Promise((resolve, reject)=> {
            sdk.tokens(args,
                 (result, err)=> {
                resolve(result, err)});
            }).catch((err) => {
                throw new Error(err)
            });
    }
}