Payway SDK NODEJS
===============

Modulo para conexión con gateway de pago Payway
  + [Introducción](#introduccion)
    + [Alcance](#alcance)
    + [Diagrama de secuencia](#diagrama-secuencia)			
  + [Instalación](#instalacion)
    + [Versiones de NODEJS soportadas](#versiones)
    + [Manual de Integración](#manualintegracion)
    + [Ambiente](#ambiente)
  + [Uso](#uso)
    + [Inicializar la clase correspondiente al conector](#initconector)
    + [Operatoria del Gateway](#operatoria)
      + [Pagos Offline](#pagos-offline)
      + [Health Check](#healthcheck)
      + [Ejecución del Pago](#payment)
      + [Operación en dos pasos](#twosteps)
      + [Comercios agregadores](#comercios-agregadores)
      + [Respuesta al pago](#respuesta-al-pago)
      + [Listado de Pagos](#getallpayments)
      + [Información de un Pago](#getpaymentinfo)
      + [Devoluciones de pagos](#refunds)
        + [Anulación / Devolución Total de Pago](#refund)
        + [Anulación de Devolución Total](#deleterefund)
        + [Devolución Parcial de un Pago](#partialrefund)
        + [Anulación de Devolución Parcial](#deletepartialrefund)
    + [Tokenizacion de tarjetas de crédito](#tokenizaciontarjeta)
      + [Listado de tarjetas tokenizadas](#listadotarjetastokenizadas)
      + [Solicitud de token de pago](#solicitudpagotokenizado)
      + [Ejecucion de pago tokenizado](#pagotokenizado)
      + [Eliminacion de tarjeta tokenizada](#eliminartarjetatokenizada)
    + [Formulario de pago](#formpago)
      
    + [Integración con Cybersource](#cybersource)
      + [Parámetros Comunes](#parámetros-comunes)
      + [Retail](#retail)
      + [Ticketing](#ticketing)
      + [Digital Goods](#digital-goods)
      + [Servies](#services)
      + [Travel](#travel)      
  + [Tablas de referencia](#tablasreferencia)
    + [Códigos de Medios de Pago](#códigos-de-medios-de-pago)
	  + [Divisas Aceptadas](#divisasa)
    + [Provincias](#provincias)

<a name="introduccion"></a>
## Introducción
El flujo de una transacción a través de las **sdks** consta de dos pasos, la **generaci&oacute;n de un token de pago** por parte del cliente y el **procesamiento de pago** por parte del comercio. Existen sdks espec&iacute;ficas para realizar estas funciones en distintos lenguajes que se detallan a continuaci&oacute;n:

+ **Generaci&oacute;n de un token de pago.**  Se utiliza alguna de las siguentes **sdks front-end** :
  + [sdk Javascript](https://github.com/payway-ar/sdk-javascript-ventaonline)
+ **Procesamiento de pago.**  Se utiliza alguna de las siguentes **sdks back-end** :
  + [sdk Java](https://github.com/payway-ar/sdk-java-ventaonline)
  + [sdk PHP](https://github.com/payway-ar/sdk-php-ventaonline)
  + [sdk .Net](https://github.com/payway-ar/sdk-net-ventaonline)
  + [sdk Node](https://github.com/payway-ar/sdk-node-ventaonline)

<a name="alcance"></a>
## Alcance
La **sdk NODEJS** provee soporte para su **aplicación back-end**, encargándose de la comunicación del comercio con la **API Payway** utilizando su **API Key privada**<sup>1</sup> y el **token de pago** generado por el cliente.

Para generar el token de pago, la aplicación cliente realizará con **Payway** a través de alguna de las siguentes **sdks front-end**:
  + [sdk Javascript](https://github.com/payway-ar/sdk-javascript-ventaonline)

![imagen de sdks](./docs/img/DiagramaSDKs.png)</br>

[Volver al inicio](#alcance)

<a name="diagrama-secuencia"></a>
## Diagrama de secuencia

El flujo de una transacción a través de las sdks consta de dos pasos, a saber:

sdk front-end: Se realiza una solicitud de token de pago con la Llave de Acceso pública (public API Key), enviando los datos sensibles de la tarjeta (PAN, mes y año de expiración, código de seguridad, titular, y tipo y número de documento) y obteniéndose como resultado un token que permitirá realizar la transacción posterior.

sdk back-end: Se ejecuta el pago con la Llave de Acceso privada (private API Key), enviando el token generado en el Paso 1 más el identificador de la transacción a nivel comercio, el monto total, la moneda y la cantidad de cuotas.

A continuación, se presenta un diagrama con el Flujo de un Pago.

![imagen de configuracion](./docs/img/FlujoPago.png)</br>

[Volver al inicio](#diagramasecuencia)

<a name="instalacion"></a>
## Instalación
Descargar la última versión del SDK desde el botón Download ZIP.		
Se debe incluirse la carpeta del SDK dentro del proyecto.		
<br />		


[Volver al inicio](#payway-sdk-node)

<a name="versiones"></a>
## Versiones de NODEJS soportadas

La versión implementada de la SDK, está testeada para las versiones 6.x de NODEJS.

[Volver al inicio](#versiones)


<a name="manualintegracion"></a>
## Manual de Integración

Se encuentra disponible la documentación **[Manual de Integración Payway](https://decidir.api-docs.io/1.0/guia-de-inicio/)** para su consulta online, en este detalla el proceso de integración. En el mismo se explican los servicios y operaciones disponibles, con ejemplos de requerimientos y respuestas, aquí sólo se ejemplificará la forma de llamar a los distintos servicios utilizando la presente SDK.

<a name="ambiente"></a>
## Ambientes

El sdk NODEJS permite trabajar con los ambientes de Sandbox y Producción de Payway. El ambiente se debe definir al instanciar el SDK.

```javascript

var ambient = "developer";//valores posibles: "developer" o "production";
var sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

```

[Volver al inicio](#ambiente)

<a name="uso"></a>
## Uso

<a name="initconector"></a>
### Inicializar la clase correspondiente al conector.

El Sdk para NODEJS permite trabajar con los ambientes de desarrollo y de producción de Payway.
El ambiente se debe instanciar como se indica a continuación.
Instanciación de la clase `Decidir\Connector`
La misma recibe como parámetros la public key o private key provisto por Payway para el comercio y el ambiente en que se trabajará.
```javascript

var publicKey = "b192e4cb99564b84bf5db5550112adea";
var privateKey = "566f2c897b5e4bfaa0ec2452f5d67f13";
var ambient = "developer";//valores posibles: "developer" o "production";

var sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

```
*Nota:* La sdk incluye un completo al cual se debe acceder desde el navegador y allí te permitirá configurar las distintas opciones.

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)
<a name="operatoria"></a>

## Operatoria del Gateway

### Pagos Offline

Para el caso de la operatoria de pago offline, la operación requiere en un principio de la solicitud de un token a partir de datos del usuario.

Una vez generado y almacenado el token de Pago Offline, se deberá ejecutar la solicitud de pago utilizando el token previamente generado. Además del token de pago y los parámetros propios de la transacción, el comercio deberá identificar la compra con el site_transaction_id.

*Aclaracion*: amount es un campo double el cual debería tener solo dos dígitos decimales.


#### Pago Fácil

![imagen de sdks](./docs/img/me-rapipago-pagofacil.jpg)</br>

|Campo | Descripcion  | Oblig | Restricciones  |Ejemplo   |
| ------------ | ------------ | ------------ | ------------ | ------------ |
|site_transaction_id  |Identificador único para la operación |  SI| 8 dígitos | site_transaction_id: "170518_35"  |
|token  |Token generado en el primer paso |  SI|  36 dígitos,variable|  token: "03508514-1578-4140-ba02-6bdd65e2af95" |
|payment_method_id  | id del tipo de metodo de Pago Offline  |  SI|  Dos dígitos |  payment_method_id: "26"|
|amount  | Monto de la operación. 6 números enteros y 2 decimales  |  SI|  8 dígitos,variable |  amount: "11.00"|
|currency  | Son los días que existen entre el 1er y 2do vencimiento  |  SI|  3 letras |  currency: "ARS"|
|payment_type  | Tipo de pago  |  SI|  Letras |  payment_type: "single"|
|email  | email del usuario que esta haciendo uso del sitio  |Condicional   |Sin validacion   | email: "user@mail.com",  |
|invoice_expiration  | Fecha en que vence el cupón  |  SI|  Formato AAMMDD |  invoice_expiration: "191123"|
|cod_p3  | Son los dias que existen entre el 1º y 2º vencimiento de la factura. |  SI|  2,fijo ("00" si la factura tiene no tiene 2° vencimientos)|  invoice_expiration: "191123"|
|cod_p4  | Días después del 1º vencimiento y hasta que el cliente pueda abonar  |  SI|  3,fijo |  cod_p4: "123"|
|client  | Codigo Cliente  |  SI|   8,fijo |  client: "12345678"|
|surcharge  | Recargo por vencimiento del plazo  |  SI|  7,variable (5 digitos enteros y 2 decimales)|  surcharge: "10.01"|
|payment_mode  | Tipo de metodo de pago  |  SI|  Strin "offline" |  payment_mode: "offline"|


##### Ejemplo
```javascript
data = {
  site_transaction_id : "230518_41",
  token: '92a95793-3321-447c-8795-8aeb8a8ac067',
  payment_method_id: 25,
  amount: 10.00,
  currency: 'ARS',
  payment_type: 'single',
  email: 'user@mail.com',
  invoice_expiration : 191123,
  cod_p3: 12,
  cod_p4: 134,
  client: 12345678,
  surcharge: 10.01,
  payment_mode: 'offline'
};


```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)

#### Rapipago

![imagen de sdks](./docs/img/me-rapipago-pagofacil.jpg)</br>

|Campo | Descripcion  | Oblig | Restricciones  |Ejemplo   |
| ------------ | ------------ | ------------ | ------------ | ------------ |
|site_transaction_id  |Identificador único para la operación |  SI| 8 dígitos | site_transaction_id: "170518_35"  |
|token  |Token generado en el primer paso |  SI|  36 dígitos,variable|  token: "03508514-1578-4140-ba02-6bdd65e2af95" |
|payment_method_id  | id del tipo de metodo de Pago Offline  |  SI|  Dos dígitos |  payment_method_id: "26"|
|amount  | Monto de la operación. 6 números enteros y 2 decimales  |  SI|  8 dígitos,variable |  amount: "11.00"|
|currency  | Son los días que existen entre el 1er y 2do vencimiento  |  SI|  3 letras |  currency: "ARS"|
|payment_type  | Tipo de pago  |  SI|  Letras |  payment_type: "single"|
|email  | email del usuario que esta haciendo uso del sitio  |Condicional   |Sin validacion   | email: "user@mail.com",  |
|invoice_expiration  | Fecha en que vence el cupón  |  SI|  Formato AAMMDD |  invoice_expiration: "191123"|
|cod_p3  | Son los dias que existen entre el 1º y 2º vencimiento de la factura. |  SI|  2,fijo ("00" si la factura tiene no tiene 2° vencimientos)|  invoice_expiration: "191123"|
|cod_p4  | Días después del 1º vencimiento y hasta que el cliente pueda abonar  |  SI|  3,fijo |  cod_p4: "123"|
|client  | Codigo Cliente  |  SI|   8,fijo |  client: "12345678"|
|surcharge  | Recargo por vencimiento del plazo  |  SI|  7,variable (5 digitos enteros y 2 decimales)|  surcharge: "10.01"|
|payment_mode  | Tipo de metodo de pago  |  SI|  Strin "offline" |  payment_mode: "offline"|


##### Ejemplo
```javascript

const data = {
  site_transaction_id: "230518_38",
  token: "8e190c82-6a63-467e-8a09-9e8fa2ab6215",
  payment_method_id: 26,
  amount: 10.00,
  currency: "ARS",
  payment_type: "single",
  email: "user@mail.com",
  invoice_expiration: "191123",
  cod_p3: "12",
  cod_p4: "134",
  client: "12345678",
  surcharge: 10.01,
  payment_mode: "offline"
};

```

#### Pago mis Cuentas

![imagen de sdks](./docs/img/me-pmc.jpg)</br>

|Campo | Descripcion  | Oblig | Restricciones  |Ejemplo   |
| ------------ | ------------ | ------------ | ------------ | ------------ |
|site_transaction_id  |Identificador único para la operación |  SI| 8 dígitos | site_transaction_id: "170518_35"  |
|token  |Token generado en el primer paso |  SI|  36 dígitos,variable|  token: "03508514-1578-4140-ba02-6bdd65e2af95" |
|payment_method_id  | id del tipo de metodo de Pago Offline  |  SI|  Dos dígitos |  payment_method_id: "26"|
|amount  | Monto de la operación. 6 números enteros y 2 decimales  |  SI|  8 dígitos,variable |  amount: "11.00"|
|currency  | Son los días que existen entre el 1er y 2do vencimiento  |  SI|  3 letras |  currency: "ARS"|
|payment_type  | Tipo de pago  |  SI|  Letras |  payment_type: "single"|
|email  | email del usuario que esta haciendo uso del sitio  |Condicional   |Sin validacion   | email: "user@mail.com",  |
|invoice_expiration  | Fecha en que vence el cupón  |  SI|  Formato AAMMDD |  invoice_expiration: "191123"|
|bank_id  | Id de banco de la operacion  |  SI|  String "offline" |  bank_id: 1 ([refencia](https://decidirv2.api-docs.io/1.0/transacciones-simples/flujo-de-pago-offline))|


##### Ejemplo
```javascript

const data = {
  site_transaction_id : "220518_39",
  token : "9ae1d130-8c89-4c3b-a267-0e97b88fedd0",
  payment_method_id : 41,
  amount : 10.00,
  currency : "ARS",
  payment_type : "single",
  email : "user@mail.com",
  bank_id : 1,
  sub_payments : 100,
  invoice_expiration : "191123"
}
```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)


#### Cobro Express

|Campo | Descripcion  | Oblig | Restricciones  |Ejemplo   |
| ------------ | ------------ | ------------ | ------------ | ------------ |
|site_transaction_id  |Identificador único para la operación |  SI| 8 dígitos | site_transaction_id: "170518_35"  |
|token  |Token generado en el primer paso |  SI|  36 dígitos,variable|  token: "03508514-1578-4140-ba02-6bdd65e2af95" |
|payment_method_id  | id del tipo de metodo de Pago Offline  |  SI|  Dos dígitos |  payment_method_id: "26"|
|amount  | Monto de la operación. 6 números enteros y 2 decimales  |  SI|  8 dígitos,variable |  amount: "11.00"|
|currency  | Son los días que existen entre el 1er y 2do vencimiento  |  SI|  3 letras |  currency: "ARS"|
|payment_type  | Tipo de pago  |  SI|  Letras |  payment_type: "single"|
|email  | email del usuario que esta haciendo uso del sitio  |Condicional   |Sin validacion   | email: "user@mail.com",  |
|invoice_expiration  | Fecha en que vence el cupón  |  SI|  Formato AAMMDD |  invoice_expiration: "191123"|
|second_invoice_expiration  | Segunda fecha de vencimiento del cupón  |  SI|  Formato AAMMDD |  second_invoice_expiration: "191123"|
|cod_p3  | Son los dias que existen entre el 1º y 2º vencimiento de la factura. |  SI|  2,fijo ("00" si la factura tiene no tiene 2° vencimientos)|  invoice_expiration: "191123"|
|client  | Codigo Cliente  |  SI|   8,fijo |  client: "12345678"|
|surcharge  | Recargo por vencimiento del plazo  |  SI|  7,variable (5 digitos enteros y 2 decimales)|  surcharge: "10.01"|
|payment_mode  | Tipo de metodo de pago  |  SI|  Strin "offline" |  payment_mode: "offline"|


##### Ejemplo
```javascript 1.8

const data = {
  site_transaction_id : "160518_42",
  token : "3df26771-67ab-4a8e-91e2-f1e0b0c559f7",
  payment_method_id : 51,
  amount : 10.00,
  currency : "ARS",
  payment_type : "single",
  email : "user@mail.com",
  invoice_expiration : "191123",
  second_invoice_expiration : "191123",
  cod_p3 : "1",
  cod_p4 : "134",
  client : "12345678",
  surcharge : 10.01,
  payment_mode : "offline"
};

```
[<sub>Volver a inicio</sub>](#payway-sdk-php)

#### Cobro Express

|Campo | Descripcion  | Oblig | Restricciones  |Ejemplo   |
| ------------ | ------------ | ------------ | ------------ | ------------ |
|site_transaction_id  |Identificador único para la operación |  SI| 8 dígitos | site_transaction_id: "170518_35"  |
|token  |Token generado en el primer paso |  SI|  36 dígitos,variable|  token: "03508514-1578-4140-ba02-6bdd65e2af95" |
|payment_method_id  | id del tipo de metodo de Pago Offline  |  SI|  Dos dígitos |  payment_method_id: "26"|
|amount  | Monto de la operación. 6 números enteros y 2 decimales  |  SI|  8 dígitos,variable |  amount: "11.00"|
|currency  | Son los días que existen entre el 1er y 2do vencimiento  |  SI|  3 letras |  currency: "ARS"|
|payment_type  | Tipo de pago  |  SI|  Letras |  payment_type: "single"|
|email  | email del usuario que esta haciendo uso del sitio  |Condicional   |Sin validacion   | email: "user@mail.com",  |
|invoice_expiration  | Fecha en que vence el cupón  |  SI|  Formato AAMMDD |  invoice_expiration: "191123"|
|second_invoice_expiration  | Segunda fecha de vencimiento del cupón  |  SI|  Formato AAMMDD |  second_invoice_expiration: "191123"|
|cod_p3  | Son los dias que existen entre el 1º y 2º vencimiento de la factura. |  SI|  2,fijo ("00" si la factura tiene no tiene 2° vencimientos)|  invoice_expiration: "191123"|
|cod_p4  | Días después del 1º vencimiento y hasta que el cliente pueda abonar  |  SI|  3,fijo |  cod_p4: "123"|
|client  | Codigo Cliente  |  SI|   8,fijo |  client: "12345678"|
|surcharge  | Recargo por vencimiento del plazo  |  SI|  7,variable (5 digitos enteros y 2 decimales)|  surcharge: "10.01"|
|payment_mode  | Tipo de metodo de pago  |  SI|  Strin "offline" |  payment_mode: "offline"|


##### Ejemplo
```javascript

const data = {
  site_transaction_id: "160518_42",
  token: "3df26771-67ab-4a8e-91e2-f1e0b0c559f7",
  payment_method_id: 51,
  amount: 10.00,
  currency: "ARS",
  payment_type: "single",
  email: "user@mail.com",
  invoice_expiration: "191123",
  second_invoice_expiration: "191123",
  cod_p3: "1",
  cod_p4: "134",
  client: "12345678",
  surcharge: 10.01,
  payment_mode: "offline"
}

```

<a name="healthcheck"></a>
### Health Check
Este recurso permite conocer el estado actual de la API RESTful de Payway.

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

sdk.healthcheck(args, function(result, err) {
    console.log("-----------------------------------------");
    console.log("healthcheck result:");
    console.log(result);
    console.log("-----------------------------------------");
    console.log("healthcheck error:");
    console.log(err);
    console.log("-------------------***-------------------");
});

```
[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)


<a name="payment"></a>

### Ejecución del Pago
Una vez generado y almacenado el token de pago, se deberá ejecutar la solicitud de pago más el token previamente generado.
Además del token de pago y los parámetros propios de la transacción, el comercio deberá identificar la compra con el site_transaction_id.

*Aclaracion* : amount es un campo double el cual debería tener solo dos dígitos.

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

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

sdk.payment(args, function(result, err) {

resolve(result);
console.log("")
console.log("Se realiza una petición de pago enviando el payload y el token de pago ")
console.log("generado anteriormente")
console.log("             PAYMENT REQUEST             ");
console.log("sendPaymentRequest result:");
console.log(result);
console.log("sendPaymentRequest error:");
console.log(err);
});

```

<a name="twosteps"></a>

### Operación en dos pasos
Una vez generado y almacenado el token de pago, se deberá ejecutar la solicitud de pago más el token previamente generado.
Si el pago es preaprobado `Status.PRE_APPROVED`, se procederá a realizar la confirmaci&oacute;n del pago enviando **ID de pago, monto y usario aprobador**.
A continuaci&oacute;n se muestra un ejemplo con una transacci&oacute;n simple sin Cybersource.

```javascript
const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

args = {
    amount: 25.50,
};

sdk.confirmPayment(args, function(result, err) {

resolve(result);
console.log("")
console.log("Se realiza una petición de confirmación de pago enviando el payload y el token de pago ")
console.log("generado anteriormente")
console.log("             CONFIRM PAYMENT REQUEST             ");
console.log("sendPaymentRequest result:");
console.log(result);
console.log("sendPaymentRequest error:");
console.log(err);
});
```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)

### Comercios agregadores

#### Campos agregador para American Express

El set de datos a enviar a la sdk son otros:

```javascript

let args = {
    "customer": {
        "id": "{{user}}",
        "email": "{{email}}",
	"ip_address": "{{ip_address}}"
    },
    "site_transaction_id": "AGREGADOR_{{$timestamp}}",
    "token": "{{token}}",
    "payment_method_id": 65,
    "bin": "{{bin}}",
    "amount": 2000,
    "currency": "ARS",
    "installments": 1,
    "description": "",
    "payment_type": "single",
    "sub_payments": [],
    "aggregate_data": {
        "indicator": "1",
        "identification_number": "30598910045",
        "bill_to_pay": "Payway_Test",
        "bill_to_refund": "Payway_Test",
        "merchant_name": "Payway",
        "street": "Lavarden",
        "number": "247",
        "postal_code": "C1437FBE",
        "category": "05044",
        "channel": "005",
        "geographic_code": "C1437",
        "city": "Ciudad de Buenos Aires",
        "merchant_id": "Payway_Agregador",
        "province": "Buenos Aires",
        "country": "Argentina",
        "merchant_email": "merchant@mail.com[13]",
        "merchant_phone": "+541135211111"
    }
}



```


### Respuesta al pago:

La respuesta de ante cualquier pago exitoso es:

```JSON

{
    "id": 971344,
    "site_transaction_id": "AGREGADOR_1527712473",
    "payment_method_id": 65,
    "card_brand": "Amex MT",
    "amount": 2000,
    "currency": "ars",
    "status": "approved",
    "status_details": {
        "ticket": "4",
        "card_authorization_code": "203430",
        "address_validation_code": "VTE0011",
        "error": null
    },
    "date": "2018-05-30T17:34Z",
    "customer": {
        "id": "juan",
        "email": "jmejia@prismamp.com",
	"ip_address": "192.168.0.1"
    },
    "bin": "373953",
    "installments": 1,
    "first_installment_expiration_date": null,
    "payment_type": "single",
    "sub_payments": [],
    "site_id": "00020220",
    "fraud_detection": {
        "status": null
    },
    "aggregate_data": {
        "indicator": "1",
        "identification_number": "30598910045",
        "bill_to_pay": "Payway_Test",
        "bill_to_refund": "Payway_Test",
        "merchant_name": "Payway",
        "street": "Lavarden",
        "number": "247",
        "postal_code": "C1437FBE",
        "category": "05044",
        "channel": "005",
        "geographic_code": "C1437",
        "city": "Ciudad de Buenos Aires",
        "merchant_id": "Payway_Agregador",
        "province": "Buenos Aires",
        "country": "Argentina",
        "merchant_email": "merchant@mail.com",
        "merchant_phone": "+541135211111"
    },
    "establishment_name": null,
    "spv": null,
    "confirmed": null,
    "pan": null,
    "customer_token": "13e550af28e73b3b00af465d5d64c15ee1f34826744a4ddf68dc6b469dc604f5",
    "card_data": "/tokens/971344"
}

```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)


<a name="getallpayments"></a>

### Listado de Pagos

Mediante este recurso, se genera una solicitud de listado de pagos.
Este recurso admite la posibilidad de agregar los filtros adicionales:

- (opcional) offset: desplazamiento en los resultados devueltos. Valor por defecto = 0.
- (opcional) pageSize: cantidad máxima de resultados retornados. Valor por defecto = 50.
- (opcional) siteOperationId: ID único de la transacción a nivel comercio (equivalente al site_transaction_id).
- (opcional) merchantId: ID Site del comercio.

```javascript

var sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

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
    console.log("infoPayments:");
    console.log(result);
    console.log("infoPayments error:");
    console.log(err);
});

```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)

<a name="getpaymentinfo"></a>

### Información de un Pago

Mediante este recurso, se genera una solicitud de información de un pago previamente realizado, pasando como parámetro el id del pago.

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

id = result.id;
const args = {
    data: {

    },
    headers: {
        "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
    }
};

sdk.paymentInfo(args, id, function(result, err) {
console.log("");
console.log("información de pago previamente realizado");
console.log("");
console.log(result);
console.log("-----------------------------------------");
console.log("error:");
console.log(err);
});

```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)

<a name="refund"></a>

### Anulación / Devolución Total de Pago

Mediante este recurso, se genera una solicitud de anulación / devolución total de un pago puntual, pasando como parámetro el id del pago.

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

id = result.id;
const args = {
    data: {

    },
    headers: {
        "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
        "Content-Type": "application/json",
        "Cache-Control": ""
    }
};
sdk.refund(args, id, function(result, err) {
console.log("Reintegro monto total de la transacción")
console.log("                  REFUND                 ");
console.log("refund result:");
console.log(result);
console.log("refund error:");
console.log(err);
});

```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)


<a name="deleterefund"></a>

### Anulación de Devolución Total

Mediante este recurso, se genera una solicitud de anulación de devolución total de un pago puntual, pasando como parámetro el id del pago y el id de la devolución.

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

paymentId = result.id;
const args = {
    data: {

    },
    headers: {
        "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
        "Content-Type": "application/json",
        "Cache-Control": ""
    }
};
sdk.deleteRefund(args, paymentId, refund_id, function(result, err) {
console.log("")
console.log("Reintegro monto total de la transacción")
console.log("                  REFUND                 ");
console.log(result);
console.log("refund error:");
console.log(err);
});

```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)

<a name="partialrefund"></a>

### Devolución Parcial de un Pago

Mediante este recurso, se genera una solicitud de devolución parcial de un pago puntual, pasando como parámetro el id del pago y el monto de la devolución.

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

paymentId = result.id;
amount = 10.50;
const args = {
    data: {
        "amount": amount
    },
    headers: {
        "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
        "Content-Type": "application/json",
        "Cache-Control": ""
    }
};
sdk.partialRefund(args, paymentId, function(result, err) {
console.log("")
console.log("Reintegro monto parcial de la transacción ")
console.log("")
console.log("              PARTIAL REFUND             ");
console.log("partial refund result:");
console.log(result);
console.log("partial refund error:");
console.log(err);
});

```

[<sub>Volver a inicio</sub>](#payway-sdk-nodejs)


<a name="deletepartialrefund"></a>

### Anulación de Devolución Parcial

Mediante este recurso, se genera una solicitud de anulación de devolución parcial de un pago puntual, pasando como parámetro el id del pago y el id de la devolución.

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

paymentId = result.id;
amount = 10.50;
const args = {
    data: {
        "amount": amount
    },
    headers: {
        "apikey": "566f2c897b5e4bfaa0ec2452f5d67f13",
        "Content-Type": "application/json",
        "Cache-Control": ""
    }
};
sdk.deletePartialRefund(args, paymentId, function(result, err) {
console.log("")
console.log("Reintegro monto parcial de la transacción ")
console.log("")
console.log("              PARTIAL REFUND             ");
console.log("partial refund result:");
console.log(result);
console.log("partial refund error:");
console.log(err);
});


```

<a name="formpago"></a>

### Formulario de pago

Este servicio permite integrar en el comercio un formulario de pago. Utiliza el recurso "validate" para obtener un hash a partir de los datos de la operacion, luego este hash sera utilizado al momento de llamar al recurso "form" el cual devolvera el formulario renderizado propio para cada comercio listo para ser utilizado y completar el flujo de pago.

![Caso2](https://raw.githubusercontent.com/decidir/sdk-nodejs-v2/master/docs/img/flujo-formulario-renderizado.png)</br>


|Campo | Descripcion  | Oblig | Restricciones  |Ejemplo   |
| ------------ | ------------ | ------------ | ------------ | ------------ |
|site.id  | Merchant  | Condicional | Numérico de 20 digitos   | id: "12365436"  |
|site.template.id  | Id de formulario de pago, el id es unico para cada comercio y es generado previamente por Payway | SI | Numérico de 20 digitos  |   |
|site.transaction_id  | Numero de operación  | SI | Alfanumérico  de 40 digitos |   |
|customer.id  | d que identifica al usuario  | NO | Alfanumérico  de 40 digitos |   |
|customer.email | Email del cliente. Se envía información del pago  | Es requerido si se desea realizar el envío de mails | Alfanumérico  de 40 digitos | email:"user@mail.com"  |
|payment.amount  | Monto de la compra  | SI | Numérico |   |
|payment.currency  | Tipo de moneda  | NO | Letras |   |
|payment.payment_method_id  | Id del medio de pago  | SI | Númerico |   |
|payment.bin  | Primeros 6 dígitos de la tarjeta  | NO | Númerico |   |
|payment.installments  | Cantidad de cuotas  | SI | Númerico |   |
|payment.payment_type  | Indica si es simple o distribuida  | SI | Valores posibles: "single", "distributed" |   |
|payment.sub_payments  | Se utiliza para pagos distribuidos. Informa los subpayments  | Es requerido si el
pago es distribuido por monto, ya que si es por porcentaje toma los configurados desde Adm Sites (SAC) | NA |   |
|success_url  | Url a donde se rediccionará una vez que el usuario finalice la operación desde la página de feedback  | SI | Númerico |   |
|cancel_url  | Url donde se rediccionará si el cliente quiere cancelar el formulario  | SI | NA |   |
|redirect_url  | Url en la cual se enviaran los datos de la operación una vez finalizada la misma para que el comercio pueda capturarlos y mostrarlos como lo desee  | Es requerido en los casos donde no informe el campo "success_url" | NA |   |

#### Ejemplo
```javascript
            var date = new Date().getTime();
            
            args = {
                site_transaction_id: "id_" + date,
		site_template_id: <id template>
                user_id: 'juanpepito',
                payment_method_id: 1,
                bin: "450799",
                amount: 25.50,
                currency: "ARS",
                installments: 1,
                description: "Description of product",
                payment_type: "single",
                sub_payments: [],
                apiKey: "5cde7e72ea1e430db94d436543523744",
                formSite: '0002031',
                'Content-Type': "application/json",
                success_url: "https://shop.swatch.com/es_ar/", //si no se informa el "redirect_url" es requerido
                cancel_url: "https://swatch.com/api/result",
                redirect_url: "", //si no se informa el success_url es requerido
                fraud_detection: [], //si no esta activado cybersource no enviar este atributo
                success_ur": "https://shop.swatch.com/es_ar/", //si no se informa el "redirect_url" es requerido
                cancel_url: "https://swatch.com/api/result",
                redirect_url: "", //si no se informa el "success_url" es requerido
                fraud_detection: array() //si no esta activado cybersource no enviar este atributo

            };


      

        var customer = {
            id: "juanpepito",
            email: "juan.pepito@hotmail.com"
        };
            var validateData = new validateMod.validate(args);

            // send_to_cs = TRUE O FALSE PARA ENVIAR PARAMETROS CS

            //Se envian sdk y parametros al modulos de payment que realizará el pago
            var instPayment = new validateMod.validate(sdk, args).then(function(result) {
                console.log("-----------------------------------------")
                console.log("Validate")
                console.log("-------------------***-------------------");
            })
    })

```


<a name="tokenizaciontarjeta"></a>

## Tokenizacion de tarjetas de crédito

Esta funcionalidad permite que luego de realizar una compra con una tarjeta, se genere un token alfanumerico unico en el backend de Payway, esto permite que a la hora de comprar nuevamente con esta tarjeta solo requerira el codigo de seguridad.
Como primer paso se debe realizar una un pago normal, el token generado estara en el campo "token" de la respuesta.

<a name="listadotarjetastokenizadas"></a>

### Listado de tarjetas tokenizadas

Este metodo permite conocer el listado de tarjetas tokenizadas que posee un usuario determinado. Para esto es necesario el nombre de usuario a la instancia de token

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

user_id = result.user_id;
const args = {
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
console.log("cardTokens result:");
console.log(result);
console.log("cardTokens error:");
console.log(err);
})
}
```

[<sub>Volver a inicio</sub>](#listadotarjetastokenizadas)


<a name="solicitudpagotokenizado"></a>

### Solicitud de token de pago

Al cargar el formulario de pago este mostrara las tarjetas tokenizadas que posee el usuario.

[<sub>Volver a inicio</sub>](#solicitudpagotokenizado)


<a name="pagotokenizado"></a>

### Ejecucion de pago tokenizado

Una vez que se obtiene el token a partir de la tarjeta tokenizada, se deberá ejecutar la solicitud de pago. Además del token de pago y los parámetros propios de la transacción, el comercio deberá identificar la compra con el "site_transaction_id" y "user_id".

```javascript

const sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

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

```

[<sub>Volver a inicio</sub>](#pagotokenizado)


<a name="eliminartarjetatokenizada"></a>

### Eliminacion de tarjeta tokenizada

El servicio da la posibilidad de eliminar un token de tarjeta generadas, esto se logra instanciando token y utilizando el metodo tokenDelete(). Funciona enviando el token de la tarjeta tokenizada.

```javascript

var sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);


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

```

[<sub>Volver a inicio</sub>](#eliminartarjetatokenizada)


<a name="cybersource"></a>

### Integración con Cybersource

Para utilizar el Servicio de Control de Fraude Cybersource, en la operación SendAuthorizeRequest, deben enviarse datos adicionales sobre la operación de compra que se quiere realizar.
Se han definido cinco verticales de negocio que requieren parámetros específicos, así como también parámetros comunes a todas las verticales.

[Volver al inicio](#cybersource)


#### Parámetros Comunes

Los parámetros comunes a todas las verticales deben enviarse junto con los datos específicos de cada uno. A continuación, describiremos los párametros comúnes que se deberan agregar a los datos de cada vertical al momento de instanciar la clase correspondiente.


```javascript

var sdk = new sdkModulo.sdk(ambient, publicKey, privateKey);

var datos_cs = {
    send_to_cs : 'true',
    channel : 'Web/Mobile/Telefonica' //una de las tres opciones son validas
    city : 'Villa General Belgrano', //Ciudad de facturación, MANDATORIO.
    country : 'AR', //País de facturación. MANDATORIO. Código ISO. (http://apps.cybersource.com/library/documentation/sbc/quickref/countries_alpha_list.pdf)
    customerid : '453458', //Identificador del usuario al que se le emite la factura. MANDATORIO. No puede contener un correo electrónico.
    email : 'Payway@hotmail.com', //Mail del usuario al que se le emite la factura. MANDATORIO.
    firstname : 'Juan' ,//Nombre del usuario al que se le emite la factura. MANDATORIO.
    lastname : 'Perez', //Apellido del usuario al que se le emite la factura. MANDATORIO.
    phone_number' : '541160913988', //Teléfono del usuario al que se le emite la factura. No utilizar guiones, puntos o espacios. Incluir código de país. MANDATORIO.
    postalcode' : ' C1010AAP', //Código Postal de la dirección de facturación. MANDATORIO.
    state : 'B', //Provincia de la dirección de facturación. MANDATORIO. Ver tabla anexa de provincias.
    street1 : 'Cerrito 740', //Domicilio de facturación (calle y nro). MANDATORIO.
    street2 : 'Piso 8', //Complemento del domicilio. (piso, departamento). NO MANDATORIO.
    currency : 'ARS', //Moneda. MANDATORIO.
    dispatch_method: 'storepickup', //Retiro del producto
    amount : '5.00', //Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO. (Ejemplos:$125,38-> 125.38 $12-> 12 o 12.00)
};

```

[Volver al inicio](#parámetros-comunes)


#### Retail

Los siguientes parámetros se deben enviar específicamente para la vertical Retail. Además se deben enviar datos específicos de cada producto involucrado en la transacción.


```javascript

var datos_cs = {
	device_unique_id : "devicefingerprintid",
	days_to_delivery: "55",
	tax_voucher_required: true,
	customer_loyality_number: "123232",
	coupon_code: "cupon22",
};


```

Para incorporar estos datos en el requerimiento inicial, se debe instanciar un objeto de la clase Retail de la siguiente manera.

```javascript


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

var datos_cs = array(
  device_unique_id : "devicefingerprintid",
  days_to_delivery: "55",
  dispatch_method: "storepickup",
  tax_voucher_required: true,
  customer_loyality_number: "123232",
  coupon_code: "cupon22",
}

var retail = new retailModulo.retailData(datos_cs);

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

```

[Volver al inicio](#payway-sdk-nodejs)


#### Ticketing

Los siguientes parámetros se deben enviar específicamente para la vertical Ticketing. Además se deben enviar datos específicos de cada producto involucrado en la transacción.

```javascript
const datos_cs = {
days_to_event: 55, //Número de días en los que se desarrollara el evento. MANDATORIO
delivery_type:'Pick up', //Tipo de envío. MANDATORIO. Valores posibles: Pick up, Email, Smartphone, Other
};

  //Datos de productos, un array con los diferentes productos involucrados.
const cs_productos = [
    {  // Producto 1
      productcode:'electronic_good', //Código de producto. MANDATORIO. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)
      productdescription:'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Descripción del producto. MANDATORIO.
      productname:'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Nombre del producto. MANDATORIO.
      productsku:'LEVJNSL36GN', //Código identificador del producto. MANDATORIO.
      totalamount:'1254.40', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO.
      quantity:'1', //Cantidad del producto. MANDATORIO.
      unitprice:'1254.40', //Formato Idem CSITTOTALAMOUNT. MANDATORIO    
    },
    {  // Producto 2
      productcode: 'default', //Código de producto. MANDATORIO. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)
      productdescription:'PENDRIVE 2GB KINGSTON', //Descripción del producto. MANDATORIO.
      productname: 'PENDRIVE 2GB', //Nombre del producto. MANDATORIO.
      productsku: 'KSPDRV2g', //Código identificador del producto. MANDATORIO.
      totalamount: '248.40', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO.
      quantity: '1', //Cantidad del producto. MANDATORIO.
      unitprice: '248.40', //Formato Idem CSITTOTALAMOUNT. MANDATORIO     
    },
    // Otros productos
    ];
    
```

Para incorporar estos datos en el requerimiento inicial, se debe instanciar un objeto de la clase Ticketing de la siguiente manera.

```javascript

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
const paymentData = new PaymentDataModulo.paymentData(args);

const datos_cs = {
  device_unique_id : "devicefingerprintid",
  days_to_delivery: "55",
  dispatch_method: "storepickup",
  tax_voucher_required: true,
  customer_loyality_number: "123232",
  coupon_code: "cupon22",
}

var ticketing = new ticketingModulo.ticketingData(datos_cs);

args.data.fraud_detection = ticketing;
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

```

[Volver al inicio](#payway-sdk-nodejs)


#### Digital Goods

Los siguientes parámetros se deben enviar específicamente para la vertical Digital Goods. Además se deben enviar datos específicos de cada producto involucrado en la transacción.


```javascript

const datos_digitalgoods = {
  device_unique_id: 'devicefingerprintid',
  digital_goods_transaction_data: {
        delivery_type: 'Pick up',
    }
};

//Datos de productos, un array con los diferentes productos involucrados.
const cs_productos = [
  {  // Producto 1
    productcode : 'electronic_good', //Código de producto. MANDATORIO. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)
    productdescription : 'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Descripción del producto. MANDATORIO.
    productname : 'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Nombre del producto. MANDATORIO.
    productsku : 'LEVJNSL36GN', //Código identificador del producto. MANDATORIO.
    totalamount : '1254.40', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO.
    quantity : '1', //Cantidad del producto. MANDATORIO.
    unitprice : '1254.40', //Formato Idem CSITTOTALAMOUNT. MANDATORIO    
  },
  {  // Producto 2
    productcode: 'default', //Código de producto. MANDATORIO. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)
    productdescription: 'PENDRIVE 2GB KINGSTON', //Descripción del producto. MANDATORIO.
    productname: 'PENDRIVE 2GB', //Nombre del producto. MANDATORIO.
    productsku: 'KSPDRV2g', //Código identificador del producto. MANDATORIO.
    totalamount: '248.40', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO.
    quantity: '1', //Cantidad del producto. MANDATORIO.
    unitprice: '248.40', //Formato Idem CSITTOTALAMOUNT. MANDATORIO     
  },
    // Otros productos
];  


```


#### Services

Los siguientes parámetros se deben enviar específicamente para la vertical Services. Además se deben enviar datos específicos de cada producto involucrado en la transacción.


```javascript

const datos_services = {
  services_transaction_data: {
        service_type: 'tiposervicio',
        reference_payment_service1: "reference1",
        reference_payment_service2: "reference2",
        reference_payment_service3: "reference3"     
    }
};

//Datos de productos, un array con los diferentes productos involucrados.
const cs_productos = [
  {  // Producto 1
    productcode : 'electronic_good', //Código de producto. MANDATORIO. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)
    productdescription : 'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Descripción del producto. MANDATORIO.
    productname : 'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Nombre del producto. MANDATORIO.
    productsku : 'LEVJNSL36GN', //Código identificador del producto. MANDATORIO.
    totalamount : '1254.40', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO.
    quantity : '1', //Cantidad del producto. MANDATORIO.
    unitprice : '1254.40', //Formato Idem CSITTOTALAMOUNT. MANDATORIO    
  },
  {  // Producto 2
    productcode: 'default', //Código de producto. MANDATORIO. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)
    productdescription: 'PENDRIVE 2GB KINGSTON', //Descripción del producto. MANDATORIO.
    productname: 'PENDRIVE 2GB', //Nombre del producto. MANDATORIO.
    productsku: 'KSPDRV2g', //Código identificador del producto. MANDATORIO.
    totalamount: '248.40', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO.
    quantity: '1', //Cantidad del producto. MANDATORIO.
    unitprice: '248.40', //Formato Idem CSITTOTALAMOUNT. MANDATORIO     
  },
    // Otros productos
];  


```

Para incorporar estos datos en el requerimiento inicial, se debe instanciar un objeto de la clase services de la siguiente manera.

```javascript

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

var datos_cs = {
  device_unique_id : "devicefingerprintid",
  days_to_delivery: "55",
  dispatch_method: "storepickup",
  tax_voucher_required: true,
  customer_loyality_number: "123232",
  coupon_code: "cupon22",
}

var services = new services.servicesData(datos_cs);

args.data.fraud_detection = services;
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

```

[Volver al inicio](#payway-sdk-nodejs)


#### Travel

Los siguientes parámetros se deben enviar específicamente para la vertical Travel.


```javascript

const datos_travel = {
      device_unique_id: "devicefingerprintid",
      travel_transaction_data: {
        reservation_code: "GJH784",
        third_party_booking: false,
        departure_city: "EZE",
        final_destination_city: "HND",
        international_flight: true,
        frequent_flier_number: "00000123",
        class_of_service: "class",
        day_of_week_of_flight: 2,
        week_of_year_of_flight: 5,
        airline_code: "AA",
        code_share: "SKYTEAM",
        decision_manager_travel: {
            complete_route: "EZE-LAX:LAX-HND",
            journey_type: "one way",
            departure_date: {
                departure_time: "2017-05-30T09:00Z",
                departure_zone: "GMT-0300"
            }
        },
        passengers: {
            email: "juan@mail.com",
            first_name: "Juan",
            last_name: "Perez",
            passport_id: "412314851231",
            phone: "541134356768",
            passenger_status: "gold",
            passenger_type: "ADT"
            }
         ,
         airline_number_of_passengers: 1

}

```

Para incorporar estos datos en el requerimiento inicial, se debe instanciar un objeto de la clase travel de la siguiente manera.

```javascript

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

var datos_cs = {
      device_unique_id: "devicefingerprintid",
      travel_transaction_dat: {
        reservation_code: "GJH784",
        third_party_booking: false,
        departure_city: "EZE",
        final_destination_city: "HND",
        international_flight: true,
        frequent_flier_number: "00000123",
        class_of_service: "class",
        day_of_week_of_flight: 2,
        week_of_year_of_flight: 5,
        airline_code: "AA",
        code_share: "SKYTEAM",
        decision_manager_travel: {
            complete_route: "EZE-LAX:LAX-HND",
            journey_type: "one way",
            departure_date: {
                departure_time: "2017-05-30T09:00Z",
                departure_zone: "GMT-0300"
            }
        },
        passengers: {
            email: "juan@mail.com",
            first_name: "Juan",
            last_name: "Perez",
            passport_id: "412314851231",
            phone: "541134356768",
            passenger_status: "gold",
            passenger_type: "ADT"
            }
         ,
         airline_number_of_passengers: 1

}

var travel = new travel.travel(datos_cs);

args.data.fraud_detection = travel;
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

```
[Volver al inicio](#payway-sdk-nodejs)



<a name="tablasreferencia"></a>

## Tablas de Referencia

### Códigos de Medios de pago

https://decidirv2.api-docs.io/1.0/tablas-de-referencia-e-informacion-para-el-implementador/medios-de-pago-disponibles

1. Visa Debito no acepta devoluciones parciales en ecommerce.


[Volver al inicio](#payway-sdk-nodejs)

<a name="divisasa"></a>
### Divisas Aceptadas

| Divisa | Descripción | Código API
---------|-------------|--------
| AR$ | Pesos Argentinos | ARS |
| U$S | Dólares Americanos | USD |

**NOTA** Si bien la API RESTful de Payway admite compras en Dólares Americanos, la legislación argentina sólo permite transacciones en Pesos Argentinos. Es por esto que Payway recomienda que todas las transacciones se cursen en dicha moneda.

[Volver al inicio](#payway-sdk-nodejs)

<a name="provincias"></a>

### Provincias

| Provincia | Código |
|----------|-------------|
| CABA | C |
| Buenos Aires | B |
| Catamarca | K |
| Chaco | H |
| Chubut | U |
| Córdoba | X |
| Corrientes | W |
| Entre Ríos | R |
| Formosa | P |
| Jujuy | Y |
| La Pampa | L |
| La Rioja | F |
| Mendoza | M |
| Misiones | N |
| Neuquén | Q |
| Río Negro | R |
| Salta | A |
| San Juan | J |
| San Luis | D |
| Santa Cruz | Z |
| Santa Fe | S |
| Santiago del Estero | G |
| Tierra del Fuego | V |
| Tucumán | T | 	

[Volver al inicio](#payway-sdk-nodejs)
