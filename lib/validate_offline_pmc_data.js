 module.exports = {
     validateOfflinePmcData: function(args) {

         this.getJSON = function() {

           dataCompare = {
                site: {
                    transaction_id: '',
                },
                payment: {
                    payment_method_id: '',                  
                    amount: '',
                    currency: '',
                    payment_mode: '',
                    invoice_expiration: '',
                }
                cancel_url: '',
            };

                    Object.keys(dataCompare).map(function(objectKey, value) {
                      if(objectKey in args) {
                    }else{
                      console.log("Error: el campo requerido "+objectKey+" no está definido o es incorrecto.");
                      return "Error: el campo requerido  "+objectKey+" no está definido o es incorrecto.";
                    }
                    
                    Object.keys(dataCompare[objectKey]).map(function(objectKey2, value) {
                      if(objectKey2 in args[objectKey]) {
                        }else{
                          console.log("Error: el campo requerido "+objectKey2+" no está definido o es incorrecto.");
                          return "Error: el campo requerido  "+objectKey2+" no está definido o es incorrecto.";
                        }
                    });
                    


                  });

             final = {
                data: {
                    site: {
                        transaction_id: '',
                    },
                    payment: {
                        payment_method_id: '',                      
                        amount: '',
                        currency: '',
                        payment_mode: '',
                        invoice_expiration: '',
                    },
                    cancel_url: '',
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
      
 }
