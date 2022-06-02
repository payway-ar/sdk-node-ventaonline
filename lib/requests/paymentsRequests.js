var Promise = require('promise');

module.exports = {
    getAllPayments: (sdk, args) => {
        return new Promise((resolve, reject) => {
            sdk.getAllPayments(args, offset, pageSize, siteOperationId, merchantId,
               function (result, err){
                    resolve(result, err)
                });
        });
    }
}
