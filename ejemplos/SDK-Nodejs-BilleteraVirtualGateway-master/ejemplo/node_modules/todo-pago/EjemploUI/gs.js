var sdk = require('../lib/todo-pago');

//console.log(process.argv.slice(2)[0]);

var params= process.argv.slice(2);

var options = {
	Authorization:params[0],
	wsdl : params[1],
	endpoint : params[2]
};
sdk.getStatus(options, params[3], params[4], function(result, err){
		console.log(result);
	});
