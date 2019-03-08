var request = require('request'),
    sinon = require('sinon'),
    proxyquire = require('proxyquire'),
    nock = require('nock'),
    dataProvider = require('./dataProvider');

var options = {
    endpoint: "developers",
    Authorization: 'TODOPAGO 1ac443c358f04c9f80bf8867efc57885'
};

var responseMockOk =  [
 					{
 						"idMedioPago": "1",
 						"nombre": "AMEX",
 						"tipoMedioPago": "Crédito",
 						"idBanco": "52",
 						"nombreBanco": "BANCO BICA"
 					},
 					{
 						"idMedioPago": "14",
 						"nombre": "MASTERCARD",
 						"tipoMedioPago": "Crédito",
 						"idBanco": "52",
 						"nombreBanco": "BANCO BICA"
 					},
 					{
 						"idMedioPago": "42",
 						"nombre": "VISA",
 						"tipoMedioPago": "Crédito",
 						"idBanco": "52",
 						"nombreBanco": "BANCO BICA"
 					}];

var responseMockFail = " ";

describe('TEST Discover Request: ', function() {
    it('Request ok', function(done) {
            console.log('')
            console.log('Expected Response ok:')
            console.log('')
            var bsa = require('../lib/BSA/bsa');
            var scope = nock('https://developers.todopago.com.ar')
                .get('/ms/discover/api/BSA/paymentMethod/discover')
                .reply(200, responseMockOk)
                bsa.getDiscover(function(result, err) {
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
            var scope = nock('https://developers.todopago.com.ar')
                .get('/ms/discover/api/BSA/paymentMethod/discover')
                .reply(702, responseMockFail)
                bsa.getDiscover(function(result, err) {
                console.log(JSON.stringify(result))
                console.log('')
                done()
            });

        })
});
