 module.exports = {
     validateOfflineCajaPagosData: function(args) {

         this.getJSON = function() {

           dataCompare = {
                site: {
                    transaction_id: '',
                    site_transaction_id: '',
                },
                customer: {
                    email: '',
                },
                payment: {
                    amount: '',
                    currency: '',
                    payment_method_id: '',
                    payment_mode: '',
                    invoice_expiration: '',
                    client: '',
                    surcharge: '',
                    cod_p2: '',
                    second_invoice_expiration: '',
                    notifications_url: '',
                    company_code: '',
                }
            };

            console.log('validate 2');
                    Object.keys(dataCompare).map(function(objectKey, value) {
                      if(objectKey in args) {
                    }else{
                      console.log("Error: el campo requerido "+objectKey+" no está definido o es incorrecto.");
                      return "Error: el campo requerido  "+objectKey+" no está definido o es incorrecto.";
                    }
                  });

             final = {
                data: {
                    site: {
                        transaction_id: '',
                        site_transaction_id: '',
                    },
                    customer: {
                        email: '',
                    },
                    payment: {
                        amount: '',
                        currency: '',
                        payment_method_id: '',
                        payment_mode: '',
                        invoice_expiration: '',
                        client: '',
                        surcharge: '',
                        cod_p2: '',
                        second_invoice_expiration: '',
                        notifications_url: '',
                        company_code: '',
                    }
                },
                 headers: {
                    //apiKey: '566f2c897b5e4bfaa0ec2452f5d67f13', //Va una apikey, la publica o la privada según el caso
                    apiKey: args.apiKey,
                    'Content-Type': args['Content-Type']
                 }
             };
        /*
	     if ("customer" in args) {
		final.data.customer = args.customer;
	     }
         */
	     return final;

         
         }         
     },
    

    validateOffline: function(sdk, args) {
        return new Promise(function(resolve, reject) {
            sdk.validate2(args, function(result, err) {
                resolve(result, err)
            });
        });
    }    
 }
