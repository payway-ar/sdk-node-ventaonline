<a name="inicio"></a>		
Todo Pago - módulo SDK-NodeJS para conexión con gateway de pago		
=======

+ [Instalación](#instalacion)
 	+ [Versiones de Nodejs soportadas](#versionesdenodesoportadas)
 	+ [Generalidades](#general)
+ [Uso](#uso)
    + [Inicializar la clase correspondiente al conector (BSA/bsa.js)](#initconector)
    + [Ambientes](#test)
    + [Billetera Virtual para Gateways](#bvg)
      + [Diagrama de Secuencia](#bvg-uml)
      + [Discover](#bvg-discover)
      + [Transaction](#bvg-transaction)
      + [Notificación Push](#bvg-push)
      + [Obtener Credenciales](#credenciales)


<a name="instalacion"></a>		
## Instalación
Se debe descargar la última versión desde del botón Download ZIP o desde https://github.com/TodoPago/sdk-nodejs/archive/master.zip.
Una vez descargado y descomprimido, debe incluirse el archivo todo-pago.js como modulo del proyecto.

[<sub>Volver a inicio</sub>](#inicio)

<a name="versionesdenodesoportadas"></a>		
#### Versiones de node soportadas
La versi&oacute;n implementada de la SDK, esta testeada para versiones desde Node 0.10.x en adelante.

[<sub>Volver a inicio</sub>](#inicio)

<a name="general"></a>
#### Generalidades
Esta versión soporta únicamente pago en moneda nacional argentina (CURRENCYCODE = 32).

[<sub>Volver a inicio</sub>](#inicio)

<a name="uso"></a>		
## Uso

<a name="initconector"></a>
#### Inicializar la clase correspondiente al conector (todo-pago.js)
- Importar el módulo:
   ```nodejs
   var sdk = require('../lib/todo-pago');
   ```
- Crear dos objetos (uno de configuración y el otro con los parámetros)
- La configuración debe contar con el ApiKey provisto por Todo Pago

```nodejs
var parameters = {
};

var options = {
	endpoint : "developers", // "developers" o "production"
	Authorization:'PRISMA f3d8b72c94ab4a06be2ef7c95490f7d3'
};
```
- Los datos como Authorization , merchantId y ApiKey se pueden obtener mediante el metodo getCredentials [Obtener Credenciales](#credenciales)


[<sub>Volver a inicio</sub>](#inicio)


<a name="BVP"></a>
### Billetera Virtual para Gateways

La Billetera Virtual para Gateways es la versión de Todo Pago para los comercios que permite utilizar los servicios de la billetera TodoPago dentro de los e-commerce, respetando y manteniendo sus respectivas promociones con bancos y marcas y números de comercio (métodos de adquirencia). Manteniendo su Gateway de pago actual, y utilizando BSA para la selección del medio de pago y la tokenizacion de la información para mayor seguridad en las transacciones.

<a name="bsa-uml"></a>
#### Diagrama de secuencia

![Diagrama de Secuencia BSA](http://www.plantuml.com/plantuml/png/ZL9BJiCm4Dtd5BDi5roW2oJw0I7ngMWlC3ZJOd0zaUq4XJknuWYz67Q-JY65bUNHlFVcpHiKZWqib2JjACdGE2baXjh1DPj3hj187fGNV20ZJehppTNWVuEEth5C4XHE5lxJAJGlN5nsJ323bP9xWWptQ42mhlXwQAlO0JpOTtZSXfMNT0YFcQzhif1MD0oJfRI22pBJdYYm1jnG-ubinjhZjcXUoQ654kQe1TiafG4srczzpE0-9-iC0f-CSDPgQ3v-wQvtLAVskTB5yHE156ISofG33dEVdFp0ccYoDQXje64z7N4P1iN_cRgZmkU8yH48Gm4JLIA3VJM0UIzrRob2H6s_xl1PAaME38voRqYH28l6DgzJqjxpaegSLE6JvJVIthZNu7BW83BVtAp7hVqTLcVezrr3Eo_jORVD8wTaoERAOHMKgXEErjwI_CpvLk_yS1ZX6pXCrhbzUM0dTsKJRoJznsMUdwOZYMirnpS0)

Para acceder al servicio, los vendedores podrán adherirse en el sitio exclusivo de Botón o a través de su ejecutivo comercial. En estos procesos se generará el usuario y clave para este servicio.

<a name="bsadiscover"></a>
El método **discover** permite conocer los medios de pago disponibles
##### Discover

 ```node
 var bsa = require('bsa.js');
 bsa.getDiscover(function (result,err){
 console.log(result);
 }
```

Se devuelve un objecto **TodoPago\BSA\Discover**, que implementa las interfaces de *Iterable* y *ArrayAccess* con una coleción de **TodoPago\BSA\PaymentMethods** conteniendo la información de cada medio de pago disponible.
Por cada medio de pago veremos lo siguiente:

Campo       | Descripción           | Tipo de dato | Ejemplo
------------|-----------------------|--------------|--------
id          | Id del medio de pago  | numérico     | 42
nombre      | Marca de la tarjeta   | string       | "VISA"
tipo        | Tipo de medio de pago | string       | "Crédito"
idBanco     | Id del banco          | numérico     | 10
nombreBanco | Nombre del banco      | string       | "Banco Ciudad"

Ejemplo de respuesta:

```
getDiscover:
[ { idMedioPago: '1',
    nombre: 'AMEX',
    tipoMedioPago: 'Crédito',
    idBanco: '52',
    nombreBanco: 'BANCO BICA' },
  { idMedioPago: '14',
    nombre: 'MASTERCARD',
    tipoMedioPago: 'Crédito',
    idBanco: '52',
    nombreBanco: 'BANCO BICA' },
  { idMedioPago: '42',
    nombre: 'VISA',
    tipoMedioPago: 'Crédito',
    idBanco: '52' } ]
```

[<sub>Volver a inicio</sub>](#inicio)

<br>

<a name="bsatransaction"></a>
##### Transaction
El método **transaction** permite registrar una transacción.

Se debe instanciar un objeto **TodoPago\BSA\Transaction** con los datos de la misma, el mismo será devuelto con los datos de la respuesta del servicio.

 ```node

 generalData = {
   "merchant":"41702",
   "security":"TODOPAGO 8A891C0676A25FBF052D1C2FFBC82DEE",
   "operationDatetime":"20170302155613",
   "remoteIpAddress":"192.168.11.87",
   "channel":"BSA"
 };

 operationData = {
   "operationType":"Compra",
   "operationID":"1234",
   "currencyCode":"032",
   "concept":"compra",
   "amount":"999,99",
   "availablePaymentMethods":[
                 "1",
                 "42"
                 ],
   "availableB":[
                 "1",
                 "42"
                 ],
   "buyerPreselection":{
               "paymentMethodId":"42",
               "bankId":"11"
             }
   };

 technicalData = {
       "sdk" : "NodeJS",
       'sdkversion' : '1.3.1',
       'lenguageversion' : '1.8',
       'pluginversion' : '2.1',
       'ecommercename' : 'DH-gate',
       'ecommerceversion' : '3.1',
       'cmsversion' : '2.4'
 };

  var bsa = require('bsa.js');
  bsa.getTransaction(generalData,operationData,technicalData,function (result,err){
  console.log(result);

}
```

Ejemplo de respuesta:

```
  getTransaction:
{ publicRequestKey: '1018ae1c-5567-4b12-a80f-51451cf0539c',
  merchantId: '41702',
  channel: '11' }

```



#### Datos de referencia

<table>
<tr><th>Nombre del campo</th><th>Required/Optional</th><th>Data Type</th><th>Comentarios</th></tr>
<tr><td>security</td><td>Required</td><td>String</td><td>Campo de autorización que deberá contener el valor del api key de la cuenta del vendedor (Merchant)</td></tr>
<tr><td>operationDatetime</td><td>Required</td><td>String</td><td>Fecha Hora de la invocación en Formato yyyyMMddHHmmssSSS</td></tr>
<tr><td>remoteIpAddress</td><td>Required</td><td>String</td><td>IP desde la cual se envía el requerimiento</td></tr>
<tr><td>merchant</td><td>Required</td><td>String</td><td>ID de cuenta del vendedor</td></tr>
<tr><td>operationType</td><td>Optional</td><td>String</td><td>Valor fijo definido para esta operatoria de integración</td></tr>
<tr><td>operationID</td><td>Required</td><td>String</td><td>ID de la operación en el eCommerce</td></tr>
<tr><td>currencyCode</td><td>Required</td><td>String</td><td>Valor fijo 32</td></tr>
<tr><td>concept</td><td>Optional</td><td>String</td><td>Especifica el concepto de la operación</td></tr>
<tr><td>amount</td><td>Required</td><td>String</td><td>Formato 999999999,99</td></tr>
<tr><td>availablePaymentMethods</td><td>Optional</td><td>Array</td><td>Array de Strings obtenidos desde el servicio de descubrimiento de medios de pago. Lista de ids de Medios de Pago habilitados para la transacción. Si no se envía están habilitados todos los Medios de Pago del usuario.</td></tr>
<tr><td>availableBanks</td><td>Optional</td><td>Array</td><td>Array de Strings obtenidos desde el servicio de descubrimiento de medios de pago. Lista de ids de Bancos habilitados para la transacción. Si no se envía están habilitados todos los bancos del usuario.</td></tr>
<tr><td>buyerPreselection</td><td>Optional</td><td>BuyerPreselection</td><td>Preselección de pago del usuario</td></tr>
<tr><td>sdk</td><td>Optional</td><td>String</td><td>Parámetro de versión de API</td></tr>
<tr><td>sdkversion</td><td>Optional</td><td>String</td><td>Parámetro de versión de API</td></tr>
<tr><td>lenguageversion</td><td>Optional</td><td>String</td><td>Parámetro de versión de API</td></tr>
<tr><td>pluginversion</td><td>Optional</td><td>String</td><td>Parámetro de versión de API</td></tr>
<tr><td>ecommercename</td><td>Optional</td><td>String</td><td>Parámetro de versión de API</td></tr>
<tr><td>ecommerceversion</td><td>Optional</td><td>String</td><td>Parámetro de versión de API</td></tr>
<tr><td>cmsversion</td><td>Optional</td><td>String</td><td>Parámetro de versión de API</td></tr>
</table>
<br>
<strong>BuyerPreselection</strong>
<br>
<table>
<tr><th>Nombre del campo</th><th>Data Type</th><th>Comentarios</th></tr>
<tr><td>paymentMethodId</td><td>String</td><td>Id del medio de pago seleccionado</td></tr>
<tr><td>bankId</td><td>String</td><td>Id del banco seleccionado</td></tr>
</table>

[<sub>Volver a inicio</sub>](#inicio)

<a name="bsapush"></a>
##### Notificación Push
El método **pushnotify** permite registrar la finalización de una transacción.

Se debe instanciar un objeto **TodoPago\BSA\PushNotify** con los datos de la misma, el mismo será devuelto con los datos de la respuesta del servicio.

 ```node

 		generalData = {
 			"merchant" : 41702,
 	    "security" : "TODOPAGO 8A891C0676A25FBF052D1C2FFBC82DEE",
 	    "operationName" : "Compra",
 	    "publicRequestKey" : "c748b257-6f35-425a-9802-9455118092ba",
 	    "remoteIpAddress" : "192.168.11.87"
 		};

 		operationData = {
 		    "resultCodeMedioPago" : -1,
 		    "resultCodeGateway" : -1,
 		    "idGateway" : 8,
 		    "resultMessage" : "APROBADA",
 		   	"operationDatetime":"20170302155613",
 		    "ticketNumber" : "1231122",
 		    "codigoAutorizacion" : "45007799",
 		    "currencyCode" : "032",
 		    "operationID" : "1234",
 		    "concept" : "compra",
 		    "amount" : "1.99",
 		    "facilitiesPayment" : "03"
 		};

 	tokenizationData = {
 		"publicTokenizationField":"sydguyt3e862t76ierh76487638rhkh7",
         "credentialMask":"4510XXXXX00001"
 	};
  var bsa = require('bsa.js');
  bsa.pushNotification(generalData,operationData,tokenizationData,function (result,err){
    console.log(result);
  });
```

Ejemplo de respuesta:

```
{ statusCode: '-1"',
  statusMessage: 'OK'}

```

#### Datos de referencia   

<table>
<tr><th>Nombre del campo</th><th>Required/Optional</th><th>Data Type</th><th>Comentarios</th></tr>
<tr><td>Security</td><td>Required</td><td>String</td><td>Authorization que deberá contener el valor del api key de la cuenta del vendedor (Merchant). Este dato viaja en el Header HTTP</td></tr>
<tr><td>Merchant</td><td>Required</td><td>String</td><td>ID de cuenta del comercio</td></tr>
<tr><td>RemoteIpAddress</td><td>Optional</td><td>String</td><td>IP desde la cual se envía el requerimiento</td></tr>
<tr><td>PublicRequestKey</td><td>Required</td><td>String</td><td>publicRequestKey de la transacción creada. Ejemplo: 710268a7-7688-c8bf-68c9-430107e6b9da</td></tr>
<tr><td>OperationName</td><td>Required</td><td>String</td><td>Valor que describe la operación a realizar, debe ser fijo entre los siguientes valores: “Compra”, “Devolucion” o “Anulacion”</td></tr>
<tr><td>ResultCodeMedioPago</td><td>Optional</td><td>String</td><td>Código de respuesta de la operación propocionado por el medio de pago</td></tr>
<tr><td>ResultCodeGateway</td><td>Optional</td><td>String</td><td>Código de respuesta de la operación propocionado por el gateway</td></tr>
<tr><td>idGateway</td><td>Optional</td><td>String</td><td>Id del Gateway que procesó el pago. Si envían el resultCodeGateway, es obligatorio que envíen este campo</td></tr>
<tr><td>ResultMessage</td><td>Optional</td><td>String</td><td>Detalle de respuesta de la operación.</td></tr>
<tr><td>OperationDatetime</td><td>Required</td><td>String</td><td>Fecha Hora de la operación en el comercio en Formato yyyyMMddHHmmssMMM</td></tr>
<tr><td>TicketNumber</td><td>Optional</td><td>String</td><td>Numero de ticket generado</td></tr>
<tr><td>CodigoAutorizacion</td><td>Optional</td><td>String</td><td>Codigo de autorización de la operación</td></tr>
<tr><td>CurrencyCode</td><td>Required</td><td>String</td><td>Valor fijo 32</td></tr>
<tr><td>OperationID</td><td>Required</td><td>String</td><td>ID de la operación en el eCommerce</td></tr>
<tr><td>Amount</td><td>Required</td><td>String</td><td>Formato 999999999,99</td></tr>
<tr><td>FacilitiesPayment</td><td>Required</td><td>String</td><td>Formato 99</td></tr>
<tr><td>Concept</td><td>Optional</td><td>String</td><td>Especifica el concepto de la operación dentro del ecommerce</td></tr>
<tr><td>PublicTokenizationField</td><td>Required</td><td>String</td><td></td></tr>
<tr><td>CredentialMask</td><td>Optional</td><td>String</td><td></td></tr>
</table>

[<sub>Volver a inicio</sub>](#inicio)

<a name="credenciales"></a>

#### Obtener Credenciales

- Los datos como Authorization , merchantId y ApiKey se pueden obtener mediante el metodo getCredentials del objeto User llamada desde el sdk.
- se debe pasar por parametro los datos de ingreso de todoPago (mail y password) en caso de no tener una cuenta podes registrarte en http://www.todopago.com.ar/registrate  y generar tus credenciales en herramientas -> comercios:integración

- un ejemplo esta en ejemplo/ejemplo.js
```
	var email = 'midirecciondemail@gmail.com';
	var pass = 'Password01';

	sdk.getCredentials(email, pass, options ,  function(result, err){
		console.log("-------------------***-------------------");
		console.log("getCredentials:");
		console.log(result);
		console.log('err: ');
		console.log(err);
		console.log("-------------------***-------------------");
	});


```

[<sub>Volver a inicio</sub>](#inicio)
