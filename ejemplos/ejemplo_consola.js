var sdkModulo = require('../lib/sdk');
var Client = require('node-rest-client').Client;
var Promise = require('promise');
var TokenDataModulo = require('../lib/token_data.js');
var PaymentDataModulo = require('../lib/payment_data.js');
var retailModulo = require('../lib/fraud_detection/cs_retail.js');
var endpoint = {
    developer: 'https://developers.decidir.com/api/v1'
}

// SE INSTANCIA SDK DECIDIR 2
var sdk = new sdkModulo.sdk('developer', "b192e4cb99564b84bf5db5550112adea", "566f2c897b5e4bfaa0ec2452f5d67f13");

// GET TOKEN Y PAGAR DOS VECES TRY ERROR
//exampleHealthCheck(sdk);
//exampleGetToken(sdk);
examplePaymentRequest(sdk);
//examplePartialRefund(sdk);
//exampleRefund(sdk);
//examplePaymentInfo(sdk);
//exampleGetAllPayments(sdk);
//exampleGetCardToken(sdk);
//exampleGetToken_Tokenized(sdk);
//examplePaymentRequest_Tokenized(sdk);
//exampleDeleteTokenizedCard(sdk);
//exampleDeletePartialRefund(sdk);
//exampleDeleteRefund(sdk);

// PAGO CON TARJETA SIN TOKENIZAR

function exampleHealthCheck(sdk) {
    var args = {
        headers: {
            "apikey": "b192e4cb99564b84bf5db5550112adea",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    };
    sdk.healthcheck(args, function(result, err) {
        console.log("-----------------------------------------");
        console.log("healthcheck result:");
        console.log(result);
        console.log("-----------------------------------------");
        console.log("healthcheck error:");
        console.log(err);
        console.log("-------------------***-------------------");
    });

};

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

        var url = endpoint.developer;
        var client = new Client();

        sdk.token(args, function(result, err) {
            resolve(result.id);

            console.log("")
            console.log("")
            console.log("Se realiza una petición token de pago")
            console.log("")
            console.log("")
            console.log("             PAYMENT REQUEST             ");
            console.log("-----------------------------------------");
            console.log("token result:");
            console.log(result);
            console.log("-----------------------------------------");
            console.log("token error:");
            console.log(err);
            console.log("-------------------***-------------------");
        });
    });
}

function examplePaymentRequest(sdk) {
    return new Promise(function(resolve, reject) {

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
            var paymentData = new PaymentDataModulo.paymentData(args);

            var args = paymentData.getJSON();
            var street1 = {
                bill: {
                    street1: 'siempreviva123'

                }
            }
            var retail = new retailModulo.retailData(street1);

            args.data.fraud_detection = retail;
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

function examplePartialRefund(sdk) {
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
            sdk.partialRefund(args, paymentId, function(result, err) {
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

function exampleRefund(sdk) {
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
            sdk.refund(args, paymentId, function(result, err) {
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



function exampleGetPayments() {

    var args = {
        headers: {
            "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }
    };

    sdk.healthcheck(args, function(result, err) {
        console.log("-----------------------------------------");
        console.log("healthcheck result:");
        console.log(result);
        console.log("-----------------------------------------");
        console.log("healthcheck error:");
        console.log(err);
        console.log("-------------------***-------------------");
    });

};

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

    sdk.getAllPayments(args, offset, pageSize, merchantId, merchantId, function(result, err) {
        console.log("-----------------------------------------");
        console.log("infoPayments:");
        console.log(result);
        console.log("-----------------------------------------");
        console.log("infoPayments error:");
        console.log(err);
        console.log("-------------------***-------------------");
    });

};

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
            sdk.paymentInfo(args, paymentId, function(result, err) {
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
// PAGO CON TARJETA TOKENIZADA

function exampleGetCardToken(sdk) {
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
                sdk.cardTokens(args, user_id, function(result, err) {
                    resolve(result);
                    console.log("");
                    console.log("");
                    console.log("Luego de realizar un primer pago se genera automaticamente un token único");
                    console.log("para la tarjeta");
                    console.log("");
                    console.log("");
                    console.log("-----------------------------------------");
                    console.log("cardTokens result:");
                    console.log(result);
                    console.log("-----------------------------------------");
                    console.log("cardTokens error:");
                    console.log(err);
                    console.log("-------------------***-------------------");
                });
            }, 3500);
        })
    })
};

function exampleGetToken_Tokenized(token, security_code) {
    return new Promise(function(resolve, reject) {
        exampleGetCardToken(sdk).then(function(result) {
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

function examplePaymentRequest_Tokenized(token, tokenizatedCard) {
    return new Promise(function(resolve, reject) {
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


            sdk.payment(args, function(result, err) {
                resolve(result.user_id);
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
        });
    })
}

function exampleDeleteTokenizedCard(tokenizatedCard) {
    args = {
        data: {

        },
        headers: {
            apiKey: "566f2c897b5e4bfaa0ec2452f5d67f13",
            'Content-Type': "application/json",
            'Cache-Control': "no-cache"
        }
    }
    sdk.deleteCardToken(args, '4507990000004905', function(result, err) {
        console.log("------------   -----------------------------");
        console.log("deleteCardToken result:");
        console.log(result);
        console.log("-----------------------------------------");
        console.log("deleteCardToken error:");
        console.log(err);
        console.log("-------------------***-------------------");
    });
}

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
            sdk.deletePartialRefund(args, paymentId, function(result, err) {
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
            sdk.deleteRefund(args, paymentId, function(result, err) {
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
