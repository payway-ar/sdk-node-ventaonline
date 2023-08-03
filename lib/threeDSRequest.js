var Promise = require('promise');

module.exports = {
    threeDSinstruction: async (sdk, args) => {
        try {
            return await new Promise((resolve, reject) => {
                sdk.threeDSinstruction(args,
                    (result, err) => {
                        resolve(result, err);
                    });
            });
        } catch (err_1) {
            throw new Error(err_1);
        }
    }
}