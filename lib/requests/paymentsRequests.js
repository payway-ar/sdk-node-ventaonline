var Promise = require('promise');

module.exports = {
    getAllPayments: (sdk, args) => {
        return new Promise((resolve, reject) => {
            sdk.getAllPayments(args, offset, pageSize, merchantId, merchantId, 
                (result, err) => {
                    resolve(result, err)
                });
        });
    }
}
