 module.exports = {
     paymentData: function(args) {
         this.getJSON = function() {
             if (!args.hasOwnProperty('site_transaction_id')) {
                 console.log("Error: el campo requerido 'site_transaction_id' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'site_transaction_id' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('token')) {
                 console.log("Error: el campo requerido 'token' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'token' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('payment_method_id')) {
                 console.log("Error: el campo requerido 'payment_method_id' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'payment_method_id' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('bin')) {
                 console.log("Error: el campo requerido 'bin' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'bin' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('amount')) {
                 console.log("Error: el campo requerido 'amount' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'amount' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('currency')) {
                 console.log("Error: el campo requerido 'currency' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'currency' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('installments')) {
                 console.log("Error: el campo requerido 'installments' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'installments' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('description')) {
                 console.log("Error: el campo requerido 'description' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'description' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('payment_type')) {
                 console.log("Error: el campo requerido 'payment_type' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'payment_type' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('apiKey')) {
                 console.log("Error: el campo requerido 'apiKey' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'apiKey' no está definido o es incorrecto.";
             }
             if (!args.hasOwnProperty('Content-Type')) {
                 console.log("Error: el campo requerido 'Content-Type' no está definido o es incorrecto.");
                 return "Error: el campo requerido 'ContentType' no está definido o es incorrecto.";
             }

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
