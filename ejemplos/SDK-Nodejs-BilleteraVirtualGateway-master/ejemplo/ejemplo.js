var bsa = require('../lib/BSA/bsa.js'); // Obtengo las funciones discover y transaction. Agregado por AA

var options = {
    endpoint: "developers",
    Authorization: 'TODOPAGO 5c0e90524632480cb80caa4482b770f8'
};



//exampleGetCredentials();
//exampleDiscover();
//exampleTransaction();
examplePushNotification();


function exampleGetCredentials() {
    var email = 'alan.corcos@softtek.com';
    var pass = 'Camino01';

    bsa.getCredentials(email, pass, options, function(result, err) {
        console.log("-------------------***-------------------");
        console.log("getCredentials:");
        console.log(result);
        console.log('Error: ');
        console.log(err);
        console.log("-------------------***-------------------");
    });
}

// Se prueba el Discover
function exampleDiscover() {
    bsa.getDiscover(function(result, err) {
        console.log("-------------------***-------------------");
        console.log("getDiscover:");
        console.log(result);
        console.log('error: ');
        console.log(err.toString('utf8'));
        //console.log("-------------------***-------------------");
    });
}

// Para el transaction.
function exampleTransaction() {
    generalData = {
        "merchant": "132788",
        "security": "TODOPAGO 5c0e90524632480cb80caa4482b770f8",
        "operationDatetime": "20170302155613",
        "remoteIpAddress": "192.168.11.87",
        "channel": "BSA"
    };

    operationData = {
        "operationType": "Compra",
        "operationID": "1234",
        "currencyCode": "032",
        "concept": "compra",
        "amount": "999,99",
        "availablePaymentMethods": [
            1,
            42
        ],
        "availableBanks": [
            1
        ],
        "buyerPreselection": {
            "paymentMethodId": 42,
            "bankId": 11
        }
    };

    technicalData = {
        "sdk": "NodeJS",
        'sdkversion': '1.3.1',
        'lenguageversion': '1.8',
        'pluginversion': '2.1',
        'ecommercename': 'DH-gate',
        'ecommerceversion': '3.1',
        'cmsversion': '2.4'
    };


    bsa.getTransaction(generalData, operationData, technicalData, function(result, err) {
        console.log("-------------------***-------------------");
        console.log("getTransaction:");
        console.log(result);
        console.log('error: ');
        console.log(err.toString('utf8'));
        console.log("-------------------***-------------------");
    });
}


// Para el PushNotification.
function examplePushNotification() {
    generalData = {
        "merchant": 132788,
        "security": "TODOPAGO 5c0e90524632480cb80caa4482b770f8",
        "operationName": "Compra",
        "publicRequestKey": "91c6bf02-0bc4-482b-806b-a14cc95fbe27",
        "remoteIpAddress": "192.168.11.87"
    };

    operationData = {
        "resultCodeMedioPago": -1,
        "resultCodeGateway": -1,
        "idGateway": 8,
        "resultMessage": "APROBADA",
        "operationDatetime": "20160425155623",
        "ticketNumber": "1231122",
        "codigoAutorizacion": "45007799",
        "currencyCode": "032",
        "operationID": "1234",
        "concept": "compra",
        "amount": "12432340,2923242",
        "facilitiesPayment": "03"
    };

    tokenizationData = {
        "publicTokenizationField": "4444444444444444",
        "credentialMask": "4510XXXXX00001"
    };


    bsa.pushNotification(generalData, operationData, tokenizationData, function(result, err) {
        console.log("-------------------***-------------------");
        console.log("pushNotification:");
        console.log(result);
        console.log('error: ');
        console.log(err);
        console.log("-------------------***-------------------");
    });
}
