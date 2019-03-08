var sdk = require('../lib/todo-pago');


var params= process.argv.slice(2);

var options = {
	Authorization:params[0],
	wsdl : params[1],
	endpoint : params[2]
};

var parameters = {
		'Security'   : params[3], 
		'Merchant' 	 : params[4],
		'RequestKey' : params[5],
		'AnswerKey'  : params[6]
	};

sdk.getAutorizeAnswer(options, parameters, function(result, err){
	console.log(result);
});