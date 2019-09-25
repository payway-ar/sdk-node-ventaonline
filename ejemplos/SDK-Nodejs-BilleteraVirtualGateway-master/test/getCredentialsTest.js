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

var responseMockOk = {
					"Credentials": {
						"codigoResultado": 1,
						"resultado": {
							"codigoResultado": 0,
							"mensajeKey": "",
							"mensajeResultado": "Aceptado"
						},
						"merchantId": "5963",
						"APIKey": "TODOPAGO 1f5a522cb9a349c68f8e9e7ac8d0db11"
					}
				};


var responseMockFail_wrongUser = {
					"Credentials": {
						"codigoResultado": 1,
						"resultado": {
							"codigoResultado": 1050,
							"mensajeKey": 1050,
							"mensajeResultado": "asasd"
						},
						"merchantId": "",
						"APIKey": ""
					}
				};

var responseMockFail_wrongPassword =  {
					"Credentials": {
						"codigoResultado": 1,
						"resultado": {
							"codigoResultado": 1055,
							"mensajeKey": 1055,
							"mensajeResultado": "asasdasd"
						},
						"merchantId": "",
						"APIKey": ""
					}
				};

describe('TEST Credentials Request: ', function() {
    it('Request ok', function(done) {
            console.log('')
            console.log('Expected Response ok:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var mail = 'valid_user@hotmail.com'
            var pass = '*********';
            var scope = nock('https://developers.todopago.com.ar')
                .post('/api/Credentials')
                .reply(200, responseMockOk)
                bsa.getCredentials(mail, pass, options, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        }),

        it('Request fail wrong user', function(done) {
            console.log('')
            console.log('Expected Response wrong user:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var wrongUser = 'xuser@hotmail.com'
            var pass = '*********';
            var scope = nock('https://developers.todopago.com.ar')
            .post('/api/Credentials')
                .reply(1050, responseMockFail_wrongUser)
                bsa.getCredentials(wrongUser, pass, options, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        }),

        it('Request fail wrong password', function(done) {
            console.log('')
            console.log('Expected Response wrong password:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var email = 'valid_user@hotmail.com';
            var wrongPass = 'wrong_pass';
            var scope = nock('https://developers.todopago.com.ar')
            .post('/api/Credentials')
                .reply(1055, responseMockFail_wrongPassword)
                bsa.getCredentials(email, wrongPass, options, function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        });
});
