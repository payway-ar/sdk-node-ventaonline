var Client = require('node-rest-client').Client;

module.exports = {
    getAllPayments: (args, offset, pageSize, siteOperationId, merchantId, callback) =>{
        client = new Client();
        var queryString = "";
        if (offset !== "" && offset !== undefined) {
            queryString += "offset=" + offset + "&";
        }
        if (pageSize !== "" && pageSize !== undefined) {
            queryString += "pageSize=" + pageSize + "&";
        }
        if (siteOperationId !== "" && siteOperationId !== undefined) {
            queryString += "siteOperationId=" + siteOperationId + "&";
        }
        if (merchantId !== "" && merchantId !== undefined) {
            queryString += "merchantId=" + merchantId + "&";
        }

        client.get(endpoint + "/payments?" + queryString, args, (data, response) =>{
            data.getLimit = function () {
                return this.limit;
            };
            data.getOffset = function (data, response) {
                return this.offset;
            };
            data.getResults = function () {
                return this.site_transaction_id;
            };
            data.hasMore = function () {
                return this.hasMore;
            };

            ret = data;
            err = "no se detectaron errores en la petición.";
            if (Buffer.isBuffer(data)) {
                data = data.toString('utf8');
                err = data;
                ret = "Ha ocurrido un error.";
            }
            callback(ret, err);
        });
    }
}