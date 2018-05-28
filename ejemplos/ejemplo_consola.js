var sdkModulo = require('../lib/sdk');
var healthcheckMod = require('../lib/healthcheck');
var paymentMod = require('../lib/payment');
var partialRefundMod = require('../lib/partial_refund');
var refundMod = require('../lib/refund');
var paymentInfoMod = require('../lib/payment_info');
var getAllPaymentsMod = require('../lib/all_payments');
var cardTokensMod = require('../lib/card_token');
var deleteCardTokenMod = require('../lib/delete_cardToken');
var deletePartialRefMod = require('../lib/delete_partialRefund');
var deleteRefMod = require('../lib/delete_refund');
var Client = require('node-rest-client').Client;
var Promise = require('promise');
var TokenDataModulo = require('../lib/token_data.js');
var PaymentDataModulo = require('../lib/payment_data.js');
var retailModulo = require('../lib/fraud_detection/cs_retail.js');

// SE INSTANCIA SDK DECIDIR 2
var sdk = new sdkModulo.sdk('developer', "b192e4cb99564b84bf5db5550112adea", "566f2c897b5e4bfaa0ec2452f5d67f13");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//EJEMPLO DE FUNCIONALIDADES

//exampleHealthCheck(sdk);
//examplePayment(sdk);
//examplePartialRefund(sdk);
//exampleRefund(sdk);
//examplePaymentInfo(sdk);
//exampleGetAllPayments(sdk);
//exampleCardTokens(sdk);
//examplePayment_Tokenized(sdk);
//exampleDeleteTokenizedCard(sdk);
//exampleDeletePartialRefund(sdk);
//exampleDeleteRefund(sdk);


// EJEMPLO ESTADO DEL SERVICIO
function exampleHealthCheck(sdk) {
    args = {}
    var instHealthCheck = new healthcheckMod.healthcheck(sdk, args).then(function(resp) {
        console.log(resp)
    })
};

// EJEMPLO REQUEST DE PAGO
function examplePayment(sdk) {
    return new Promise(function(resolve, reject) {
        //SE OBTIENE UN TOKEN DE PAGO
        exampleGetToken(sdk).then(function(token) {
            var date = new Date().getTime();
            args = {
                site_transaction_id: "id_" + date,
                token: token,
                user_id: 'juanpepito',
                payment_method_id: 1,
                bin: "450799",
                amount: 25.50,
                currency: "ARS",
                installments: 1,
                description: "Description of product",
                payment_type: "single",
                sub_payments: [],
                apiKey: "566f2c897b5e4bfaa0ec2452f5d67f13",
                'Content-Type': "application/json"
            };
		var customer = {
			id: "juanpepito",
			email: "mauricio.ghiorzi@softtek.com"
		};

            var paymentData = new PaymentDataModulo.paymentData(args);
	    paymentData.setCustomer(customer);
            var args = paymentData.getJSON();

            // send_to_cs = TRUE O FALSE PARA ENVIAR PARAMETROS CS
            var send_to_cs = true;

            if (send_to_cs == true) {
                var datos_cs = {
                    send_to_cs: true,
                    channel: 'Web/Mobile/Telefonica',
                    city: 'Buenos Aires',
                    country: 'AR',
                    customer_id: 'martinid',
                    email: 'accept@decidir.com.ar',
                    first_name: 'martin',
                    last_name: 'paoletta',
                    phone_number: '1547766329',
                    postal_code: '1427',
                    state: 'BA',
                    street1: 'GARCIA DEL RIO 4041',
                    street2: 'GARCIA DEL RIO 4041'
                };
                args.data.fraud_detection = datos_cs;
            }

            //Se envian sdk y parametros al modulos de payment que realizará el pago
            var instPayment = new paymentMod.payment(sdk, args).then(function(result) {
                console.log("")
                console.log("")
                console.log("Se realiza una petición de pago enviando el payload y el token de pago ")
                console.log("generado anteriormente")
                console.log("")
                console.log("")
                console.log("             PAYMENT REQUEST             ");
                console.log("-----------------------------------------");
                console.log("sendPaymentRequest result:");
                console.log(result);
                console.log("-----------------------------------------");
                console.log("sendPaymentRequest error:");
                console.log(err);
                console.log("-------------------***-------------------");
            })
        })
    })
}

//EJEMPLO DEVOLUCIÖN PARCIAL
function examplePartialRefund(sdk) {
    //SE HACE UN PAGO PARA PODER REALIZAR LA DEVOLUCIÓN
    var instPayment = examplePaymentRequest(sdk).then(function(result) {
        paymentId = result.id;
        amount = 10.50;
        var args = {
            data: {
                amount: amount
            },
            headers: {
                "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
                "Content-Type": "application/json",
                "Cache-Control": ""
            }
        };
        setTimeout(function() {
            var instPartialRefund = new partialRefundMod.partialRefund(sdk, paymentId, args).then(function(resp) {
                console.log("")
                console.log("")
                console.log("Reintegro monto parcial de la transacción ")
                console.log("")
                console.log("")
                console.log("              PARTIAL REFUND             ");
                console.log("-----------------------------------------");
                console.log("partial refund result:");
                console.log(resp);
                console.log("-----------------------------------------");
                console.log("partial refund error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        }, 2000);
    });
}

//EJEMPLO DE DEVOLUCIÓN TOTAL
function exampleRefund(sdk) {
    //SE HACE UN PAGO PARA PODER REALIZAR LA DEVOLUCIÓN
    examplePaymentRequest(sdk).then(function(result) {
        paymentId = result.id;
        var args = {
            data: {

            },
            headers: {
                "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
                "Content-Type": "application/json",
                "Cache-Control": ""
            }
        };
        setTimeout(function() {
            var instPartialRefund = new partialRefundMod.partialRefund(sdk, paymentId, args).then(function(resp) {
                console.log("")
                console.log("")
                console.log("Reintegro monto total de la transacción")
                console.log("")
                console.log("")
                console.log("                  REFUND                 ");
                console.log("-----------------------------------------");
                console.log("refund result:");
                console.log(resp);
                console.log("-----------------------------------------");
                console.log("refund error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        }, 2000);
    })
};
//SE OBTIENE INFORMACION DE UN PAGO EN ESPECÍFICO
function examplePaymentInfo(sdk) {
    examplePaymentRequest(sdk).then(function(result) {
        paymentId = result.id;
        var args = {
            data: {

            },
            headers: {
                "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        };
        setTimeout(function() {
            var paymentInfo = new paymentInfoMod.paymentInfo(sdk, paymentId, args).then(function(resp) {
                console.log("");
                console.log("");
                console.log("información de pago previamente realizado");
                console.log("");
                console.log("");
                console.log(result);
                console.log("-----------------------------------------");
                console.log("error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        }, 2000);
    });
};
//SE OBTIENE INFORMACION DE TODOS LOS PAGOS SEGUN LOS FILTROS QUE SE LE ENVÍEN COMO PARAMETROS
function exampleGetAllPayments(sdk) {
    var args = {
        data: {

        },
        headers: {
            "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    };
    offset = '10';
    pageSize = '20';
    siteOperationId = '450799';
    merchantId = 'Id001';

    var allPayments = new getAllPaymentsMod.getAllPayments(sdk, args).then(function(resp) {
        console.log("-----------------------------------------");
        console.log("infoPayments:");
        console.log(resp);
        console.log("-----------------------------------------");
        console.log("infoPayments error:");
        console.log(err);
        console.log("-------------------***-------------------");
    });

};

//SE OBTIENE TOKEN DE UNA TARJETA PREVIAMENTE TOKENIZADA
function exampleCardTokens(sdk) {
    return new Promise(function(resolve, reject) {
        examplePaymentRequest(sdk).then(function(result) {
            user_id = result.user_id;
            var args = {
                data: {

                },
                headers: {
                    "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache"
                }
            };
            setTimeout(function() {
                var cardTokens = new cardTokensMod.cardTokens(sdk, args).then(function(resp) {
                    resolve(resp);
                    console.log("");
                    console.log("");
                    console.log("Luego de realizar un primer pago se genera automaticamente un token único");
                    console.log("para la tarjeta");
                    console.log("");
                    console.log("");
                    console.log("-----------------------------------------");
                    console.log("cardTokens result:");
                    console.log(resp);
                    console.log("-----------------------------------------");
                    console.log("cardTokens error:");
                    console.log(err);
                    console.log("-------------------***-------------------");
                });
            }, 3500);
        })
    })
};

//SE REALIZA UN PAGO CON TARJETA TOKENIZADA
function examplePayment_Tokenized(sdk) {
    //SE OBTIENE TOKEN DE PAGO DE TARJETA TOKENIZADA
    exampleGetToken_Tokenized(sdk).then(function(token) {
        var date = new Date().getTime();
        args = {
            site_transaction_id: "id_" + date,
            token: token,
            user_id: 'juanpepito',
            payment_method_id: 1,
            bin: "450799",
            amount: 2000,
            currency: "ARS",
            installments: 1,
            description: "Description of product",
            payment_type: "single",
            sub_payments: [],
            apiKey: "566f2c897b5e4bfaa0ec2452f5d67f13",
            'Content-Type': "application/json"
        };
        var paymentData = new PaymentDataModulo.paymentData(args);

        var args = paymentData.getJSON();
        var instPayment = new paymentMod.payment(sdk, args).then(function(result) {
            console.log("")
            console.log("")
            console.log("Se realiza una petición de pago enviando el payload y el token de pago ")
            console.log("de la tarjeta tokenizada")
            console.log("")
            console.log("")
            console.log("             PAYMENT REQUEST             ");
            console.log("-----------------------------------------");
            console.log("sendPaymentRequest result:");
            console.log(result);
            console.log("-----------------------------------------");
            console.log("sendPaymentRequest error:");
            console.log(err);
            console.log("-------------------***-------------------");
        });
    })
}

function exampleDeleteTokenizedCard(sdk) {
    args = {
        data: {

        },
        headers: {
            apiKey: "566f2c897b5e4bfaa0ec2452f5d67f13",
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }
    }
    var instDeleteCardToken = new deleteCardTokenMod.deleteCardToken(sdk, '4507990000004905', args).then(function(result) {
        console.log("------------   -----------------------------");
        console.log("deleteCardToken result:");
        console.log(result);
        console.log("-----------------------------------------");
        console.log("deleteCardToken error:");
        console.log(err);
        console.log("-------------------***-------------------");
    });
}

//ANULACIÓN DE LA DEVOLUCIÓN PARCIAL
function exampleDeletePartialRefund(sdk) {
    examplePaymentRequest(sdk).then(function(result) {
        paymentId = result.id;
        amount = 10.50;
        var args = {
            data: {
                "amount": amount
            },
            headers: {
                "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
                "Content-Type": "application/json",
                "Cache-Control": ""
            }
        };
        setTimeout(function() {
            var instDeletePartialRef = new deletePartialRefMod.deletePartialRefund(sdk, paymentId, args).then(function(result) {
                console.log("")
                console.log("")
                console.log("Reintegro monto parcial de la transacción ")
                console.log("")
                console.log("")
                console.log("              PARTIAL REFUND             ");
                console.log("-----------------------------------------");
                console.log("partial refund result:");
                console.log(result);
                console.log("-----------------------------------------");
                console.log("partial refund error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        }, 2000);
    });
};

//ANULACIÓN DE LA DEVOLUCIÓN
function exampleDeleteRefund(sdk) {
    examplePaymentRequest(sdk).then(function(result) {
        paymentId = result.id;
        var args = {
            data: {

            },
            headers: {
                "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
                "Content-Type": "application/json",
                "Cache-Control": ""
            }
        };
        setTimeout(function() {
            var instDeleteRef = new deleteRefMod.deleteRefund(sdk, paymentId, args).then(function(result) {
                console.log("")
                console.log("")
                console.log("Reintegro monto total de la transacción")
                console.log("")
                console.log("")
                console.log("                  REFUND                 ");
                console.log("-----------------------------------------");
                console.log("refund result:");
                console.log(result);
                console.log("-----------------------------------------");
                console.log("refund error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        }, 2000);
    })
};

// EXTRAS
//exampleGetToken(sdk);
//exampleGetToken_Tokenized(sdk);

var endpoint = {
    developer: 'https://developers.decidir.com/api/v1'
}

function exampleGetToken(sdk) {
    return new Promise(function(resolve, reject) {

        args = {
            card_number: '4507990000004905',
            card_expiration_month: '08',
            card_expiration_year: "18",
            security_code: "775",
            card_holder_name: "John Doe",
            type: "dni",
            number: "25123456",
            apiKey: "b192e4cb99564b84bf5db5550112adea",
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }

        var tokenData = new TokenDataModulo.tokenData(args);

        var args = tokenData.getJSON();

        var client = new Client();

        client.post('https://developers.decidir.com/api/v1' + "/tokens", args, function(data, response) {
            resolve(data.id);

            if (Buffer.isBuffer(data)) {
                data = JSON.parse(data.toString('utf8'));
                //console.log(response);
            }
        });
    });
}

// PAGO CON TARJETA TOKENIZADA

function exampleGetToken_Tokenized(token, security_code) {
    return new Promise(function(resolve, reject) {
        exampleCardTokens(sdk).then(function(result) {

            args = {
                token: result.tokens[0].token,
                security_code: '775',
                apiKey: "b192e4cb99564b84bf5db5550112adea",
                'Content-Type': "application/json",
                'Cache-Control': "no-cache"
            }
            var tokenData = new TokenDataModulo.tokenData(args);
            var args = tokenData.getJSON();
            var url = endpoint.developer;
            var client = new Client();
            client.post(endpoint.developer + "/tokens", args, function(data, response) {
                resolve(data.id);
                var payToken = data.id;
                console.log("")
                console.log("")
                console.log("Se genera un token de pago enviando únicamente el id de la tarjeta tokenizada y el security_code")
                console.log("")
                console.log("")
                console.log("Token")
                console.log("-----------------------------------------");
                console.log(payToken);
                console.log("-----------------------------------------");
                console.log("-------------------***-------------------");
            });
        });
    });
}

function examplePaymentRequest(sdk) {

    return new Promise(function(resolve, reject) {

        exampleGetToken().then(function(token) {

            var date = new Date().getTime();

            args = {
                site_transaction_id: "id_" + date,
                token: token,
                user_id: 'juanpepito',
                payment_method_id: 1,
                bin: "450799",
                amount: 25.50,
                currency: "ARS",
                installments: 1,
                description: "Description of product",
                payment_type: "single",
                sub_payments: [],
                apiKey: "566f2c897b5e4bfaa0ec2452f5d67f13",
                'Content-Type': "application/json"
            };
            var paymentData = new PaymentDataModulo.paymentData(args);

            var args = paymentData.getJSON();

            var datos_cs = {
                send_to_cs: 'true',
                channel: 'Web/Mobile/Telefonica',
                city: 'Buenos Aires',
                country: 'AR',
                customer_id: 'martinid',
                email: 'accept@decidir.com.ar',
                first_name: 'martin',
                last_name: 'paoletta',
                phone_number: '1547766329',
                postal_code: '1427',
                state: 'BA',
                street1: 'GARCIA DEL RIO 4041',
                street2: 'GARCIA DEL RIO 4041'
            }

            sdk.payment(args, function(result, err) {
                resolve(result);
                console.log("")
                console.log("")
                console.log("Se realiza una petición de pago enviando el payload y el token de pago ")
                console.log("generado anteriormente")
                console.log("")
                console.log("")
                console.log("             PAYMENT REQUEST             ");
                console.log("-----------------------------------------");
                console.log("sendPaymentRequest result:");
                console.log(result);
                console.log("-----------------------------------------");
                console.log("sendPaymentRequest error:");
                console.log(err);
                console.log("-------------------***-------------------");
            });
        });
    });
}
