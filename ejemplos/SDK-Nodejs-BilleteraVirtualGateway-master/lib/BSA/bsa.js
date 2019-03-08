var baseEndpoint = 'https://developers.todopago.com.ar/';
var Client = require('node-rest-client').Client;
var restClient = new Client();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = {
    getCredentials: function(email, pass, options, callback) {
        var d = new Date();

        var args = {
            data: {
                "USUARIO": email,
                "CLAVE": pass
            },
            headers: {
                "Content-Type": "application/json"
            }
        };

        var req = restClient.post(baseEndpoint + 'api/Credentials', args, function(data, response) {

            if (Buffer.isBuffer(data)) {
                data = JSON.parse(data.toString('utf8'));
            }

            err = null;

            if (data.Credentials.resultado.codigoResultado == 0) {

                this.merchantId = data.Credentials.merchantId;
                this.apiKey = data.Credentials.APIKey;

            } else {
                this.merchantId = '';
                this.apiKey = '';
                err = d.toISOString() + '- ERROR : ' + data.Credentials.resultado.codigoResultado + ', message: ' + data.Credentials.resultado.mensajeResultado;
            }
            var credentials = {
                'merchantId': this.merchantId,
                'apiKey': this.apiKey
            };

            callback(credentials, err);
        });
    },

    getDiscover: function(callback) {
        console.log(baseEndpoint + 'ms/discover/api/BSA/paymentMethod/discover');
                                       //bsa/discover/api/BSA/paymentMethod/discover
        restClient.get(baseEndpoint + 'ms/discover/api/BSA/paymentMethod/discover', function(data, result) {
            callback(data, data);
        });
    },

    getTransaction: function(generalData, operationData, technicalData, callback) {
        if (operationData.buyerPreselection && operationData.buyerPreselection.paymentMethodId && validateInteger(operationData.buyerPreselection.paymentMethodId) != true) {
            errorMessage = 'paymentMethodId debe ser tipo integer. Por favor, revíselo e intente nuevamente la operación.'
            callback(errorMessage, errorMessage);
            return;
        }
        if (operationData.buyerPreselection && operationData.buyerPreselection.bankId && validateInteger(operationData.buyerPreselection.bankId) != true) {
            errorMessage = 'bankId debe ser tipo integer. Por favor, revíselo e intente nuevamente la operación.'
            callback(errorMessage, errorMessage);
            return;
        }
        for (indice in operationData.availablePaymentMethods) {
            if (validateInteger(operationData.availablePaymentMethods[indice]) != true) {
                errorMessage = 'El valor ' + operationData.availablePaymentMethods[indice] + ' del array "availablePaymentMethods" debe ser tipo integer. Por favor, revíselo e intente nuevamente la operación.'
                callback(errorMessage, errorMessage);
                return;
            }
        }
        for (indice in operationData.availableBanks) {
            if (validateInteger(operationData.availableBanks[indice]) != true) {
                errorMessage = 'El valor ' + operationData.availableBanks[indice] + ' del array "availableBanks" debe ser tipo integer. Por favor, revíselo e intente nuevamente la operación.'
                callback(errorMessage, errorMessage);
                return;
            }
        }
        var arrayData = {};
        arrayData['operationData'] = operationData;
        arrayData['generalData'] = generalData;
        arrayData['technicalData'] = technicalData;
        var args = {
            rejectUnauthorized: false,
            data: JSON.stringify(arrayData),
            headers: {
                "Content-Type": "application/json",
		"Authorization": generalData["security"]
            }
        };

        restClient.post(baseEndpoint + 'ms/tx/v1/bsa', args, function(data, result) {
            callback(data, data);
        });
    },

    pushNotification: function(generalData, operationData, tokenizationData, callback) {

        if (validateInteger(generalData.merchant) != true) {
            errorMessage = 'merchant debe ser tipo integer. Por favor, revíselo e intente nuevamente la operación.'
            callback(errorMessage, errorMessage);
            return;
        }

        if (isValidDate(operationData.operationDatetime) == false) {
            errorMessage = 'operationDatetime no tiene un formato válido. Por favor, revíselo e intente nuevamente la operación.'
            callback(errorMessage, errorMessage);
            return;
        }
        if (validateIp(generalData.remoteIpAddress) != true) {
            errorMessage = 'La ip no tiene un formato válido. Por favor, revíselo e intente nuevamente la operación.'
            callback(errorMessage, errorMessage);
            return;
        }
        operationData.amount = validateAmount(operationData.amount);

        var arrayData = {};
        arrayData['operationData'] = operationData;
        arrayData['generalData'] = generalData;
        arrayData['tokenizationData'] = tokenizationData;

        var args = {
            data: JSON.stringify(arrayData),
            headers: {
                "Content-Type": "application/json",
		"Authorization": generalData["security"]
            }
        };

        restClient.put(baseEndpoint + 'ms/tx/v1/bsa/'+generalData["publicRequestKey"], args, function(data, result) {
          err = data.toString('utf8');
            callback(data, err);
        });
    }
};

function validateInteger(data) {
    if(data != "") {
        if (typeof(data) == 'number') {
            return true;
        }
    }
}

function isValidDate(dateString) {
    var regEx = /^\d{4}\d{2}\d{2}\d{2}\d{2}\d{2}$/;
    return dateString.match(regEx) != null;
}

function validateIp(dateString) {
    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(generalData.remoteIpAddress)
}

function validateAmount(amount) {
    var number = parseFloat(operationData.amount.replace(',', '.'))
    var fixedNumber = number.toFixed(2)
    var amount = fixedNumber.toString();
    amount = amount.replace('.', ',');
    return amount;
}
