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

function validateIp(ip) {
    var regex =  /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/igm;
    if(ip.match(regex)){
        return true;
    }else{
        return false;
    }
}

function validateAmount(amount) {
    var number = parseFloat(amount.replace(',', '.'))
    var fixedNumber = number.toFixed(2)
    var amount = fixedNumber.toString();
    amount = amount.replace('.', ',');
    return amount;
}
