 module.exports = {
     paymentData: function(args) {

         this.getJSON = function() {
           dataCompare = {
                        site_transaction_id: '',
                        token: '',
                        user_id: '',
                        payment_method_id: '',
                        bin: '',
                        amount: '',
                        currency: '',
                        installments: '',
                        description:'',
                        payment_type: '',
                        sub_payments: ''
                    }
                    Object.keys(dataCompare).map(function(objectKey, value) {
                      if(objectKey in args) {
                    }else{
                      console.log("Error: el campo requerido "+objectKey+" no está definido o es incorrecto.");
                      return "Error: el campo requerido  "+objectKey+" no está definido o es incorrecto.";
                    }
                  });

             return args = {
                 data: {
                     site_transaction_id: args.site_transaction_id,
                     token: args.token,
                     user_id: args.user_id,
                     payment_method_id: args.payment_method_id,
                     bin: args.bin,
                     amount: args.amount,
                     currency: args.currency,
                     installments: args.installments,
                     description: args.description,
                     payment_type: args.payment_type,
                     sub_payments: args.sub_payments,
                     fraud_detection: args.fraud_detection
                 },
                 headers: {
                     apiKey: args.apiKey,
                     'Content-Type': args['Content-Type']
                 }

             };
         }
         this.getSiteTransactionId = function() {
             return args.site_transaction_id;
         };
         this.getToken = function() {
             return args.token;
         };
         this.getUserId = function() {
             return args.userId;
         };
         this.getPaymentMethodId = function() {
             return args.payment_method_id;
         };
         this.getBin = function() {
             return args.bin;
         };
         this.getAmount = function() {
             return args.amount;
         };
         this.getCurrency = function() {
             return args.currency;
         };
         this.getInstallments = function() {
             return args.installments;
         };
         this.getDescription = function() {
             return args.description;
         };
         this.getPaymentType = function() {
             return args.payment_type;
         };
         this.getSubPayments = function() {
             return args.sub_payments;
         };
         this.getApiKey = function() {
             return args.apiKey;
         };
         this.getContentType = function() {
             return args['Content-Type'];
         };
     }
 }
