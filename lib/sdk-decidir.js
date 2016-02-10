module.exports = {
	parseToAuthorizeRequest:function(optionsAuthorize) {
		var payload = "<Request>";
		for(var key in optionsAuthorize.Payload) { 
			var value = optionsAuthorize.Payload[key]; 
			payload += "<" + key + ">" + value + "</" + key + ">";
		}
		payload += "</Request>";
		optionsAuthorize.Payload = payload;
		return optionsAuthorize;
	},	
	getPaymentValuesPCI : function (options, parameters, callback){
		var soap = require('soap');		
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		var config = {
			"endpoint": options.endpoint
		};
		soap.createClient(options.wsdl, config, function(err, client) {
			var xml = module.exports.parseToAuthorizeRequest(parameters);
			client.GetAuthorizeAnswer(xml, function(err, result) {
				callback(result);
			},null,{Authorization:options.apikey});
		});
	},
	queryPayment : function (options, parameters, callback){
		var soap = require('soap');		
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		var config = {
			"endpoint": options.endpoint
		};
		soap.createClient(options.wsdl, config, function(err, client) {    
			client.Execute(parameters, function(err, result) {
				callback(result);
			},null,{Authorization:options.apikey});
		});
	},
	getPaymentValues : function (options, parameters, callback){
		var soap = require('soap');		
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
		var config = {
			"endpoint": options.endpoint
		};
		soap.createClient(options.wsdl, config, function(err, client) {
			var xml = module.exports.parseToAuthorizeRequest(parameters);
			client.SendAuthorizeRequest(xml, function(err, result) {
				callback(result);
			},null,{Authorization:options.apikey});
		});
	},
};