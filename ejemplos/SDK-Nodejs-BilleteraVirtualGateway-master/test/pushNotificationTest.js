var request = require('request'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire'),
    nock = require('nock')

var options = {
    endpoint: "developers",
    Authorization: 'TODOPAGO 1ac443c358f04c9f80bf8867efc57885'
};

generalData = {
    "merchant": 41702,
    "security": "TODOPAGO 8A891C0676A25FBF052D1C2FFBC82DEE",
    "operationName": "Compra",
    "publicRequestKey": "3fc8dcee-dd46-40f2-a178-0f74f01221eb",
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

var responseMockOk = {"statusCode":"-1","statusMessage":"OK"};

var responseMockFail_withoutField = {"statusCode":"1014","statusMessage":"Completá este campo."};

var responseMockFail_wrongTransaction = {"statusCode":"2070","statusMessage":"Lo sentimos, la referencia a la transacción enviada es inválida."};

describe('TEST Push Notification Request: ', function() {
    it('Request ok', function(done) {
            console.log('')
            console.log('Expected Response ok:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var scope = nock('https://developers.todopago.com.ar')
                .post('/ms/transactions/api/BSA/transaction/notificacionPush')
                .reply(200, responseMockOk)
            bsa.pushNotification(generalData, operationData, tokenizationData, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        }),

        it('Request fail without field', function(done) {
            console.log('')
            console.log('Expected Response fail without field:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            generalData.security = '';
            var scope = nock('https://developers.todopago.com.ar')
            .post('/ms/transactions/api/BSA/transaction/notificacionPush')
                .reply(1014, responseMockFail_withoutField)
            bsa.pushNotification(generalData, operationData, tokenizationData, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        }),

        it('Request fail wrong transaction', function(done) {
            console.log('')
            console.log('Expected Response wrong transaction:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var wrongId = '4444';
            operationData.operationID = wrongId;
            var scope = nock('https://developers.todopago.com.ar')
            .post('/ms/transactions/api/BSA/transaction/notificacionPush')
                .reply(2070, responseMockFail_wrongTransaction)
            bsa.pushNotification(generalData, operationData, tokenizationData, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        });
});
