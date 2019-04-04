var request = require('request'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire'),
    nock = require('nock'),
    dataProvider = require('./dataProvider');

var options = {
    endpoint: "developers",
    Authorization: 'TODOPAGO 1ac443c358f04c9f80bf8867efc57885'
};

var generalData = {
    "merchant": "15846",
    "security": "TODOPAGO 1ac443c358f04c9f80bf8867efc57885",
    "operationDatetime": "20170302155613",
    "remoteIpAddress": "192.168.11.87",
    "channel": "BSA"
};

var operationData = {
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

var technicalData = {
    "sdk": "NodeJS",
    'sdkversion': '1.3.1',
    'lenguageversion': '1.8',
    'pluginversion': '2.1',
    'ecommercename': 'DH-gate',
    'ecommerceversion': '3.1',
    'cmsversion': '2.4'
};

var responseMockOk = {"publicRequestKey":"1cb1567a-08f3-4558-ab7e-2b492236acce","merchantId":"41702","channel":"11"};

var responseMockFail = {"errorCode":"1014","errorMessage":"Completá este campo.","channel":"11"};

var responseMockFailVendor = {"errorCode":"702","errorMessage":"Cuenta de vendedor invalida","channel":"11"};

describe('TEST Transaction Request: ', function() {
    it('Request ok', function(done) {
            console.log('')
            console.log('Expected Response ok:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var scope = nock('https://developers.todopago.com.ar')
                .post('/ms/transactions/api/BSA/transaction')
                .reply(200, responseMockOk)
                bsa.getTransaction(generalData, operationData, technicalData, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        }),

        it('Request fail', function(done) {
            console.log('')
            console.log('Expected Response fail:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            generalData.security = '';
            var scope = nock('https://developers.todopago.com.ar')
                .post('/ms/transactions/api/BSA/transaction')
                .reply(1014, responseMockFail)
                bsa.getTransaction(generalData, operationData, technicalData, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        }),

        it('Request fail invalid vendor', function(done) {
            console.log('')
            console.log('Expected Response invalid vendor:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var wrongId = '4444';
            operationData.operationID = wrongId;
            var scope = nock('https://developers.todopago.com.ar')
                .post('/ms/transactions/api/BSA/transaction')
                .reply(702, responseMockFailVendor)
                bsa.getTransaction(generalData, operationData, technicalData, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        });
});
