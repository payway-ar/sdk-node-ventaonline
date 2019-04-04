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


var parameters = {
	'Merchant'   : params[3],
	'EncodingMethod'   : params[4],
	'Security'   : params[5],
	'URL_OK'   : params[6],
	'URL_ERROR'   : params[7],
	'EMAILCLIENTE'   : params[8],
	'Session'   : params[9]
};
//Control de Fraude
var fraudControl = {
	'MERCHANT'   : params[10],
	'OPERATIONID'   : params[11],
	'CURRENCYCODE'   : params[12],
	'AMOUNT'   : params[13],
	    //fraud control
	'CSBTCITY'   : params[14],
	'CSBTEMAIL'   : params[15],
	'CSBTFIRSTNAME'   : params[16],
	'CSBTPOSTALCODE'   : params[17],
	'CSBTSTREET1'   : params[18],
	'CSBTIPADDRESS'   : params[19],
	'CSPTGRANDTOTALAMOUNT'   : params[20],
	'CSMDD6'   : params[21],
	'CSMDD8'   : params[22],
	'CSMDD10'   : params[23],
	'CSBTCOUNTRY'   : params[24],
	'CSBTPHONENUMBER'   : params[25],
	'CSBTLASTNAME'   : params[26],
	'CSBTSTATE'   : params[27],
	'CSBTSTREET2'   : params[28],
	'CSBTCUSTOMERID'   : params[29],
	'CSPTCURRENCY'   : params[30],
	'CSMDD7'   : params[31],
	'CSMDD9'   : params[32],
	'CSMDD11'   : params[33],
	    //retail
	'CSSTCITY'   : params[34],
	'CSSTEMAIL'   : params[35],
	'CSSTFIRSTNAME'   : params[36],
	'CSSTPOSTALCODE'   : params[37],
	'CSSTSTREET1'   : params[38],
	'CSSTCOUNTRY'   : params[39],
	'CSSTPHONENUMBER'   : params[40],
	'CSSTLASTNAME'   : params[41],
	'CSSTSTATE'   : params[42],
	'CSSTSTREET2'   : params[43],
	'CSITPRODUCTCODE'   : params[44],
	'CSITPRODUCTNAME'   : params[45],
	'CSITTOTALAMOUNT'   : params[46],
	'CSITUNITPRICE'   : params[47],
	'CSITPRODUCTDESCRIPTION'   : params[48],
	'CSITPRODUCTSKU'   : params[49],
	'CSITQUANTITY'   : params[50],
	'CSMDD12'   : params[51],
	'CSMDD14'   : params[52],
	'CSMDD16'   : params[53],
	'CSMDD13'   : params[54],
	'CSMDD15'   : params[55]
	};
	
	sdk.sendAutorizeRequest(options, parameters, fraudControl, function(result, err){
		console.log(result);
	});