var http = require('http');
var sdk = require('sdk-decidir');

http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});	
	var parameters = {
		'NROCOMERCIO' : '12345678',
		'NROOPERACION' : 'test_22111',
		'MONTO' : '1.00',
		'CUOTAS' : '01',
		'MEDIODEPAGO' : '1',
		'MONEDA' : '1',
		'EMAILCLIENTE' : 'cliente@email.com.ar',
		'TIPODOC' : '1',
		'NRODOC' : '11999999',
		'CALLE' : 'Cerrito',
		'NROPUERTA' : '740',
		'URL_OK' : 'http://www.google.com',
		'URL_ERROR' : 'http://www.yahoo.com',
		'Merchant' : '12345678',
		'Security' : '1234567890ABCDEF1234567890ABCDEF',
		'EncodingMethod' : 'XML',
		'Operation':'Compra',
		'USUARRIO':'gustavito',
		'PASSWORD':'83878439487298749823749823479',
		'NOMBREENTARJETA':'Juan carlos',
		'NROTARJETA':'38746823746',
		'VENTARJETA':'0316',
		'CODSEGURIDAD':'3424',
	};
	var options = {
		wsdl : 'https://200.69.248.51:8443/services/t/decidir.net/Authorize?wsdl',
		endpoint : "https://200.69.248.51:8443/services/t/decidir.net/Authorize",
		apikey: 'PRISMA 1234567890ABCDEF1234567890ABCDEF'
	};
	
	sdk.getPaymentValues(options, parameters, function(result){
		console.log("-------------------");
		console.log("getPaymentValues");
		console.log(result);
		console.log("-------------------");
	});
	
	
	sdk.getPaymentValuesPCI(options, parameters, function(result){
		console.log("-------------------");
		console.log("getPaymentValuesPCI");
		console.log(result);
		console.log("-------------------");
	});
	
	var paramQueryPayment = {
		'Security' : '1234567890ABCDEF1234567890ABCDEF',
		'Merchant' : '12345',
		'RequestKey' : '0123-1234-2345-3456-4567-5678-6789',
		'AnswerKey' : '111122223333444455556666' 
	};
	
	sdk.queryPayment(options, paramQueryPayment, function(result){
		console.log("-------------------");
		console.log("queryPayment");
		console.log(result);
		console.log("-------------------");
	});
}).listen(8080);
 
console.log('Servidor ejecutándose en http://127.0.0.1:8081/');
