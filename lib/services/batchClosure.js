var Client = require('node-rest-client').Client;

module.exports = {

    batchClosure: (endpoint, apikey, args, callback) => {
        const client = new Client();
        const arg = {
            data: args,
            headers: {
                apikey: apikey,
                'Content-Type': "application/json",
            }
        };

        client.post(`${endpoint}/closures/batchclosure`, arg, (data, response) => {
            try {
                let ret;
                if (Buffer.isBuffer(data)) {
                    data = data.toString('utf8');
                }
                try {
                    ret = JSON.parse(data);
                } catch (parseError) {
                    ret = data;
                }

                const err = "";
                callback(ret, err);
            } catch (error) {
                callback(null, error.message);
            }
        });
    }
}