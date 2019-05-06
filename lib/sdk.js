var Client = require('node-rest-client').Client;


module.exports = {
    sdk: function (environment, publicKey, privateKey) {
        var decidirVersion="1.3.2"
        var publicKey = publicKey;
        var privateKey = privateKey;
        var endpoint;
        if (environment == 'developer') {
            endpoint = 'https://developers.decidir.com/api/v2'
        } else if (environment == 'production') {
            endpoint = 'https://live.decidir.com/api/v2'
        }

        this.healthcheck = function (args, callback) {
            client = new Client();

            client.get(endpoint + "/healthcheck", args, function (data, response) {
                data = JSON.parse(data.toString('utf8'));

                data.getName = function (data, response) {
                    return this.name;
                };
                data.getVersion = function (data, response) {
                    return this.version;
                };
                data.getBuildTime = function (data, response) {
                    return this.buildTime;
                };

                ret = data;
                err = "No hubo error.";

                if (Buffer.isBuffer(data)) {
                    data = data.toString('utf8');
                    err = data;
                }
                callback(ret, err);
            });
        },

            this.getAllPayments = function (args, offset, pageSize, siteOperationId, merchantId, callback) {
                client = new Client();
                var queryString = "";
                if (offset !== "" && offset !== undefined) {
                    queryString += "offset=" + offset + "&";
                }
                if (pageSize !== "" && pageSize !== undefined) {
                    queryString += "pageSize=" + pageSize + "&";
                }
                if (siteOperationId !== "" && siteOperationId !== undefined) {
                    queryString += "siteOperationId=" + siteOperationId + "&";
                }
                if (merchantId !== "" && merchantId !== undefined) {
                    queryString += "merchantId=" + merchantId + "&";
                }

                client.get(endpoint + "/payments?" + queryString, args, function (data, response) {
                    data.getLimit = function () {
                        return this.limit;
                    };
                    data.getOffset = function (data, response) {
                        return this.offset;
                    };
                    data.getResults = function () {
                        return this.site_transaction_id;
                    };
                    data.hasMore = function () {
                        return this.hasMore;
                    };


                    ret = data;
                    err = "no se detectaron errores en la petición.";
                    if (Buffer.isBuffer(data)) {
                        data = data.toString('utf8');
                        err = data;
                        ret = "Ha ocurrido un error.";
                    }
                    callback(ret, err);
                });
            },

            this.validate = function (args, callback) {
                client = new Client();
                var endpoint="https://developers.decidir.com/web";
                console.log('endpoint: ' + endpoint);

             //console.log(args);



            args = {
                data: {
                      "site": {
                        "transaction_id": args.site_transaction_id,
                        "template": {
                          "id": 5
                        }
                      },
                      "customer": {
                        "id": args.user_id,
                        "email": args.email,
                          "identification": {
                                "type": args.identification_type,
                                "number": args.identification_number
                          },
                          "door_number": args.door_number,
                          "date_of_birth": args.date_of_birth                        
                        },
                      "payment": {
                        "amount": parseInt(args.amount*100),
                        "currency": args.currency,
                        "payment_method_id": args.payment_method_id,
                        "bin": args.bin,
                        "installments": args.installments,
                        "payment_type": args.payment_type,
                        "sub_payments": []
                      },
                      "success_url": args.success_url,
                      "cancel_url": args.cancel_url,
                      "fraud_detection": [],
                },
                
                headers: {
                    //apiKey: '566f2c897b5e4bfaa0ec2452f5d67f13', //Va una apikey, la publica o la privada según el caso
                    apikey: args.apiKey,
                    'X-Consumer-Username': args.formSite,
                    'Content-Type': args['Content-Type']                  
                 }
             };




             //console.log(args);
             //rocess.exit();

                client.post(endpoint + "/validate", args, function (data, response) {

                    ret = data;
                    //console.log(data);
                    //console.log(response);
  
                    err = "no se detectaron errores en la petición.";
                    if (!data.hasOwnProperty('hash')) {
                        if(response.statusCode==200){
                            var json = JSON.parse(data);
                            json.getHash = function () {
                                return this.hash;
                            };
                        }
                        err = json
                        ret = "Ha ocurrido un error.";
                    }
                    
                    callback(ret, err);
                });
            },

            this.tokens = function (args, callback) {
                client = new Client();

                args = {
                    data: {
                          "public_token": args.public_token,
                          "volatile_encrypted_data": args.volatile_encrypted_data,
                          "public_request_key": args.public_request_key,
                          "issue_date": args.issue_date,
                          "flag_security_code": args.flag_security_code,
                          "flag_tokenization": args.flag_tokenization,
                          "flag_selector_key": args.flag_selector_key,
                          "flag_pei": args.flag_pei,
                          "card_holder_name": args.card_holder_name,
                          "card_holder_identification": {
                            "type": args.card_holder_identification_type,
                            "number": args.card_holder_identification_number
                          },
                          "fraud_detection": {
                            "device_unique_identifier": args.fraud_detection_device_unique_identifier
                          }
                    },
                    
                    headers: {
                        apikey: args.apiKey,
                        'Content-Type': args['Content-Type']                  
                     }
                 };




                 console.log(args);
                 //rocess.exit();

                client.post(endpoint + "/tokens", args, function (data, response) {

                    ret = data;
                    console.log(data);
                    //console.log(response);
  
                    err = "no se detectaron errores en la petición.";
                    if (!data.hasOwnProperty('hash')) {
                        if(response.statusCode==200){
                            var json = JSON.parse(data);
                            json.getHash = function () {
                                return this.hash;
                            };
                        }
                        err = json
                        ret = "Ha ocurrido un error.";
                    }
                    
                    callback(ret, err);
                });
            },

            this.paymentInfo = function (args, id, callback) {


                client = new Client();

                console.log(endpoint + "/payments/" + id);

                client.get(endpoint + "/payments/" + id, args, function (data, response) {

                    data.getStatus = function () {
                        return this.status;
                    };
                    data.getId = function (data, response) {
                        return this.id;
                    };
                    data.getSiteTransactionId = function () {
                        return this.site_transaction_id;
                    };
                    data.getToken = function () {
                        return this.token;
                    };
                    data.getUserId = function () {
                        return this.userId;
                    };
                    data.getPaymentMethodId = function () {
                        return this.payment_method_id;
                    };
                    data.getBin = function () {
                        return this.bin;
                    };
                    data.getAmount = function () {
                        return this.amount;
                    };
                    data.getCurrency = function () {
                        return this.currency;
                    };
                    data.getInstallments = function () {
                        return this.installments;
                    };
                    data.getPaymentType = function () {
                        return this.payment_type;
                    };
                    data.getSubPayments = function () {
                        return this.sub_payments;
                    };

                    ret = data;
                    err = "no se detectaron errores en la petición.";
                    if (!data.hasOwnProperty('status')) {
                        console.log(data);

                        /*
                        var json = JSON.parse(data);
                        json.getErrorType = function () {
                            return this.error_type;
                        };
                        json.getEntityName = function () {
                            return this.entity_name;
                        };
                        json.getId = function () {
                            return this.id;
                        };
                        */
                        err = data
                        ret = "Ha ocurrido un error.";
                    }
                    callback(ret, err);
                });
            },
            this.cardTokens = function (args, user_id, callback) {

                client = new Client();

                client.get(endpoint + "/usersite/" + user_id + "/cardtokens", args, function (data, response) {
                    data.getToken = function () {
                        return this.token;
                    };
                    data.getPaymentMethodId = function () {
                        return this.payment_method_id;
                    };
                    data.getBin = function () {
                        return this.bin;
                    };
                    data.getLastFourDigits = function () {
                        return this.last_four_digits;
                    };
                    data.getExpirationMonth = function () {
                        return this.expiration_month;
                    };
                    data.getExpirationYear = function () {
                        return this.expiration_year;
                    };
                    data.getExpired = function () {
                        return this.expired;
                    };
                    ret = data;
                    err = "no se detectaron errores en la petición.";
                    if (!data.hasOwnProperty('tokens')) {
                        var json = JSON.parse(data);
                        json.getMessage = function () {
                            return this.message;
                        };
                        err = json
                        ret = "Ha ocurrido un error.";
                    }
                    callback(ret, err);
                });
            },
            this.payment = function (args, callback) {
                client = new Client();
                if (!args.data.amount % 1 == 0) {
                    args.data.amount = args.data.amount * 100;
                }

                client.post(endpoint + "/payments", args, function (data, response) {


                    data.getStatus = function () {
                        return this.status;
                    };
                    data.getId = function (data, response) {
                        return this.id;
                    };
                    data.getSiteTransactionId = function () {
                        return this.site_transaction_id;
                    };
                    data.getToken = function () {
                        return this.token;
                    };
                    data.getUserId = function () {
                        return this.userId;
                    };
                    data.getPaymentMethodId = function () {
                        return this.payment_method_id;
                    };
                    data.getBin = function () {
                        return this.bin;
                    };
                    data.getAmount = function () {
                        return this.amount;
                    };
                    data.getCurrency = function () {
                        return this.currency;
                    };
                    data.getInstallments = function () {
                        return this.installments;
                    };
                    data.getPaymentType = function () {
                        return this.payment_type;
                    };
                    data.getSubPayments = function () {
                        return this.sub_payments;
                    };
                    data.getDate = function () {
                        return this.date;
                    }
                    data.getTicket = function () {
                        return this.status_details.ticket;
                    }
                    data.getAuthorization = function () {
                        return this.status_details.card_authorization_code;
                    }

                    if (!args.data.amount % 1 == 0) {
                        data.amount = data.amount / 100;
                    }
                    ret = data;
                    err = "no se detectaron errores en la petición.";
                    if (!data.hasOwnProperty('status')) {
                        data.getErrorType = function () {
                            return this.error_type;
                        };
                        data.getValidationErrors = function () {
                            return this.validation_errors;
                        };
                        err = data;
                        ret = "Ha ocurrido un error.";
                    }
                    callback(ret, err);
                });
            },

            this.partialRefund = function (args, id, callback) {
                client = new Client();
                if (!args.data.amount % 1 == 0) {
                    args.data.amount = args.data.amount * 100;
                }
                client.post(endpoint + "/payments/" + id + "/refunds", args, function (data, response) {
                    if (!data.hasOwnProperty('status')) {

                        data.getErrorType = function () {
                            return this.error_type;
                        };
                        data.getValidationErrors = function () {
                            return this.validation_errors;
                        };
                        err = data
                        ret = "Ha ocurrido un error.";
                    } else {
                        data.getStatus = function () {
                            return this.status;
                        };
                        data.getId = function () {
                            return this.id;
                        };
                        data.getAmount = function () {
                            return this.amount;
                        };
                        data.getSubPayments = function () {
                            return this.sub_payments;
                        };
                        if (!args.data.amount % 1 == 0) {
                            data.amount = data.amount / 100;
                        }
                        ret = data;
                        err = "no se detectaron errores en la petición.";

                    }
                    callback(ret, err);
                });
            },

            this.refund = function (args, id, callback) {

                client = new Client();

                client.post(endpoint + "/payments/" + id + "/refunds", args, function (data, response) {
                    data.getStatus = function () {
                        return this.status;
                    };
                    data.getId = function () {
                        return this.id;
                    };
                    data.getAmount = function () {
                        return this.amount;
                    };
                    data.getSubPayments = function () {
                        return this.sub_payments;
                    };
                    ret = data;
                    err = "no se detectaron errores en la petición.";

                    console.log(data);

                    if (!data.hasOwnProperty('status') && !eval(data)) {
                        var json = JSON.parse(data);
                        json.getErrorType = function () {
                            return this.error_type;
                        };
                        json.getEntityName = function () {
                            return this.entity_name;
                        };
                        json.getId = function () {
                            return this.id;
                        };
                        err = json
                        ret = "Ha ocurrido un error.";
                    }
                    callback(ret, err);
                });
            },

            this.deletePartialRefund = function (args, id, callback) {
                client = new Client();
                if (!args.data.amount % 1 == 0) {
                    args.data.amount = args.data.amount * 100;
                }
                client.delete(endpoint + "/payments/" + id + "/refunds", args, function (data, response) {
                    if (!args.data.amount % 1 == 0) {
                        data.amount = data.amount / 100;
                    }
                    ret = data;
                    err = "no se detectaron errores en la petición.";
                    if (Buffer.isBuffer(data)) {
                        data = data.toString('utf8');
                        err = data;
                    }
                    callback(ret, err);
                });
            },

            this.deleteRefund = function (args, id, callback) {

                client = new Client();

                client.delete(endpoint + "/payments/" + id + "/refunds", args, function (data, response) {

                    ret = data;
                    err = "No hubo error.";
                    if (Buffer.isBuffer(data)) {
                        data = data.toString('utf8');
                        err = data;
                    }
                    callback(ret, err);
                });
            },
            this.deleteCardToken = function (args, tokenizedCard, callback) {

                client = new Client();
                client.delete(endpoint + "/cardtokens/" + tokenizedCard, args, function (data, response) {
                    ret = data;
                    err = "No hubo error.";
                    if (Buffer.isBuffer(data)) {
                        data = data.toString('utf8');
                        err = data;
                    }
                    callback(ret, err);
                });
            }
    }
}
