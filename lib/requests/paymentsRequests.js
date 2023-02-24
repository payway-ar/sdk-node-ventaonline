var Promise = require('promise');

module.exports = {
    getAllPayments: (sdk, args) => {
        return new Promise((resolve, reject) => {
            sdk.getAllPayments(args, offset, pageSize, siteOperationId, merchantId,
               function (result, err){
                    resolve(result, err)
                })
        }).catch((err) => {
            throw new Error(err)
        });
    },
    payment: (sdk, args) => {
        console.log("llego");
        return new Promise((resolve, reject)=> {
            sdk.payment(args,
                 (result, err)=> { 
                resolve(result, err)
            });
        }).catch((err) => {
            throw new Error(err)
        });
    }


}
