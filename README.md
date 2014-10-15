<a name="inicio"></a>
sdk-Node
=======

Modulo para conexión con gateway de pago DECIDIR

######[Instalación](#instalacion)
######[Uso](#uso)
######[Implementación para Comercios PCI](#pci)
######[Integración con CyberSource] (#cybersource) 
######[Ejemplo](#ejemplo)
######[Modo test](#test)
######[Tablas de referencia](#tablas)
 
<a name="instalacion"></a>
## Instalación
Se debe descargar la última versión desde del botón Download ZIP o desde https://github.com/decidir/sdk-nodejs/archive/master.zip.
Una vez descargado y descomprimido, debe incluirse la carpeta sdk-decidir en el proyecto

Instalar con [npm](http://github.com/isaacs/npm):

```
  npm install sdk-decidir
```
<br />
[<sub>Volver a inicio</sub>](#inicio)

<a name="uso"></a>
## Uso
####1.Inicializar la clase correspondiente al sdk.
``` javascript
var sdk = require('sdk-decidir');
```

####2.Solicitud de autorización
En este caso hay que llamar a getPaymentValues(). 
```javascript
var options = {
	wsdl : 'https://200.69.248.51:8443/services/t/decidir.net/Authorize?wsdl',
	endpoint : "https://200.69.248.51:8443/services/t/decidir.net/Authorize",	
};
sdk.getPaymentValues(options, parameters, function(result){
	console.log(result);
});
```
<ins><strong>Parámetros generales para todo tipo de operacion</strong></ins>
parameters debe ser un array con la siguiente estructura:

```javascript
var parameters = {
		'Merchant':'', //IdSite, provisto por SPS DECIDIR. MANDATORIO.
		'Session':'', //null, para uso futuro.NO MANDATORIO.
		'Security':'', //Token de seguridad, provisto por SPS DECIDIR. MANDATORIO.
		'URL_OK':'http://susitio.com/paydecidir/ok', //url a la que desea ser devuleto el comprador cuando realize una transacción exitosa. MANDATORIO.
		'URL_ERROR':'http://susitio.com/paydecidir/error', //url a la que desea ser devuelto el comprador cuando no realice una transacción exitosa. MANDATORIO.
		'NROCOMERCIO' : '12345678', //Nro de comercio provisto por SPS-DECIDIR. MANDATORIO.
		'NROOPERACION' : '00000012', //String mediante el cual el comercio identifica univocamente la transacción. MANDATORIO.
		'MONTO' : '10998.00', //Importe en pesos de la transacción. MANDATORIO.
		'CUOTAS' : '09', //Cantidad de coutas. MANDATORIO.
		'MEDIODEPAGO' : '1', //La tabla de medios de pagos se encuentra al final de la documentación. MANDATORIO.
		'EMAILCLIENTE' : 'cliente@cliente.com', //NO MANDATORIO
		....................................................
		);
```
<strong>Consideraciones para los medios de pago offline</strong>
El parámetro NROOPERACION enviado debe ser numérico.
Los parámetros adicionales a enviar en el requerimiento inicial son los siguientes:

<ins>Rapipago:</ins>
```javascript
var parameters = array (
		.....................................................
		'CODMEDPAGO':'214', //Valor fijo: “214”-Dato fijo. MANDATORIO. Numérico, 3 dígitos
		'CODDECIDIR':'0012', //Identifica a DECIDIR ante Rapipago. Dato fijo. MANDATORIO. Numérico, 4 dígitos
		'CANTDIASFECHAVENC':'08', //Son los días que existen entre el 1º y 2º vencimiento de la factura. Poner “00” si la factura no tiene 2º vencimiento. MANDATORIO. Numérico, 2 dígitos.
		'CANTDIASPAGO':'12', //Son los días después del 1º vencimiento y hasta el que el cliente puede pagar la factura por Rapipago. MANDATORIO. Numérico, 3 dígitos.
		'RECARGO':'788290', //(7882.90)Recargo por vencimiento del plazo. Dato generado por el comercio. Es un monto (no un porcentaje). 5 cifras enteras y 2 decimales. ($$$$$¢¢). MANDATORIO. Numérico, 7 dígitos
		'FECHAVTO': '140325', //Fecha de vencimiento para el pago del cuplan. Dato generado por el comercio. (AAMMDD). MANDATORIO. Numérico, 6 dígitos.
		'CLIENTE':'80097765', //Código de cliente provisto por Rapipago al momento de habilitar el comercio. Dato fijo. MANDATORIO. Numérico, 8 dígitos.
		....................................................
		);
```

<ins>Pago Fácil (CajaDePagos):</ins>
```javascript
var parameters = array (
		.....................................................
		'CODMEDPAGO':'1434', //Valor fijo: “1434”. MANDATORIO. Numérico, 4 dígitos.
		'RECARGO':'123', //(1.23)Se debe enviar el monto toal para el segundo vencimiento. Dato generado por el comercio. 4 cifras enteras y 2 decimales. ($$$$$¢¢). MANDATORIO. Numérico, 6 dígitos.
		'FECHAVTO': '140325', //Fecha de vencimiento para el pago del cupón. Dato generado por el comercio. (AAMMDD). MANDATORIO. Numérico, 6 dígitos.
		'FECHAVTO2': '140325', //Fecha del segundo vencimiento para el pago del cupón. Dato generado por el comercio. (AAMMDD). MANDATORIO. Numérico, 6 dígitos.
		....................................................
		);
```

<ins>Consideraciones para Pagomiscuentas (Banelco)</ins>
El parámetro NROOPERACION actúa como identificador de factura por lo que admite sólo 20 caracteres alfanuméricos.
```javascript
var parameters = {
		.....................................................
		'FECHAVTO': '300515 2309', //Fecha y hora de vencimiento de la factura. Puede omitirse las “horas” y “minutos”, informando solo la fecha con formato DDMMYY. MANDATORIO. (DDMMYY HHMM)
		....................................................
		);
```

<ins>Requerimiento adicionales de VISA para comercios Agregadores.</ins>
```javascript
var parameters = array (
		.....................................................
		'AINDICADOR':0, //Indicador del tipo de documento. Numérico, 1 dígito. Valores posibles(0:cuit, 1:cuil, 2:número único).
		'ADOCUMENTO':'2325xxxxxx9', //Número de CUIT, CUIL o Número Único(en el último caso se debe completar con ceros a la izquierda)
		'AFACTPAGAR':'c0000234321', //Número de factura a pagar. Alfanumérico de 12 caracteres.
		'AFACTDEVOL':'c0000234320', // Número de factura de anulación/devolución,
		'ANOMBRECOM':'jorge/Rufalo',  //Nombre del comercio o nombre y apellido del vendedor. Alfanumérico 20 caracteres. en el caso de nombre y apellido debe estar separado por "/".
		'ADOMICILIOCOMERCIO':'Salta', //Dirección del comercio o vendedor. Alfanumérico 20 caracteres.
		'ANROPUERTA':'153', //Número de puerta. Alfanumérico 6 caracteres
		'ACODPOSTAL':'H3509XAP', //Código postal. Alfanumérico de 8 caracteres.
		'ARUBRO':'', //Código de actividad (rubro). Alfanumérico de 5 caracteres.
		'ACODCANAL':'', //Código de canal. Alfanumérico de 3 caracteres.
		'ACODGEOGRAFICO':'',//Código geográfico del vendedor. Alfanumérico de 5 caracteres.
		....................................................
		);
```
<ins>Consideraciones para split de transacciones</ins>
<p>por montos fijos</p>
```javascript
var parameters = {
	'NROCOMERCIO':'12345678'//Número de comercio padre provisto por SPS DECIDIR. Alfanumérico de 8 caracteres.
	'IMPDIST':'123.4#12#12.05',//Importe de cada una de las substransacciones. Los importes deben postearse separados por "#".
	'SITEDIST':'00100511#0234803245#00230031',//Número de comercio de cada uno de los subcomercios asociados al comercio padre
	'CUOTASDIST':'01#06#24',//cantidad de cuotas para cada subcomercio. Decimal de 2 dígitos.
	'IDMODALIDAD':'S',// indica si la transacción es distribuida. (S= transacción distribuida; N y null = no distribida)
	................................................................
);
```
<ins>por porcentaje</ins>
```javascript
var parameters = {
	................................................................
	'IDMODALIDAD':'S',// indica si la transacción es distribuida. (S= transacción distribuida; N y null = no distribida)
	................................................................
);
```

El método getPaymentValues devolvera un arreglo con los siguiente valores:
```javascript
var parameters = {
	'StatusCode':'-1'//
	'StatusMessage':'Solicitud de Autorizacion Registrada',//ej: Solicitud de Autorizacion Registrada
	'URL_Request':'https://payment.decidir.net/Authorization/FEDCBA09876543211234567890ABCDEF',//url a la que se debe redirigir al cliente
	'RequestKey':'0123-1234-2345-3456-4567-5678-6789',//clave de serguridad que será solicitada en el siguiente método para la confirmación del pago por parte del cliente
);
```

####3.Confirmación de transacción (no aplica para comercios PCI).
En este caso hay que llamar a queryPayment(), enviando como parámetro un array como se describe a continuación.
```javascript
var parameters ={
		'Security' : '1234567890ABCDEF1234567890ABCDEF',
		'Merchant' : '12345',
		'RequestKey' : '0123-1234-2345-3456-4567-5678-6789',
		'AnswerKey' : '111122223333444455556666' // *Importante
);
```
<strong><ins>*Importante:</ins></strong>El campo Answer viaja en el callback que se haga desde el sitio de Decidir cuando vuelva la respuesta (Se redirige agregando un parametro "Answer"), para nuestro ejemplo: <strong>https://ecommerce.merchant.com.ar/NotifyResponseErrorPayment?Order=test_22111&Answer=111122223333444455556666</strong>

```javascript
var parameters = {
  'StatusCode' : -1, //int
  'StatusMessage' :'APROBADA',
  'AuthorizationKey' :'urn:uuid:1294329EF2FD1AD8361412182693137',
  'EncodingMethod':'XML',
  'Payload' : { 
       'Answer' : { 
          'IDMOTIVO' :'0',
          'RESULTADO' :'APROBADA',
          'FECHAHORA' : '2014/08/11 15:24:38',
          'MOTIVO' : 'APROBADA',
          'MONEDA' : 'Pesos',
          'NROTICKET' : '12',
          'NROTARJETAVISIBLE' : '450799XXXXXX4905',
          'CODAUTORIZACION' : '000038'
        }, 
       'Request' : { 
          'NROCOMERCIO' : '12345678',
          'NROOPERACION' : 'test_22111',
          'MEDIODEPAGO' : '1', 
          'MONTO' : '1.00',
          'MONEDA' : '1', 
          'CUOTAS' : '01', 
          'EMAILCLIENTE' : 'cliente@email.com.ar', 
          'TIPODOC' : '1',
          'NRODOC' : '11999999',
          'CALLE' : 'Cerrito',
          'NROPUERTA' : '740'
        }
   }
}
```
Este método devuelve el resumen de los datos de la transacción, para que puedan ser mostrados al cliente.
<br />
[<sub>Volver a inicio</sub>](#inicio)
<a name="pci"></a>
##Integración para circuito de 2 pasos
Además de los parámetros para la solicitu de autorización se deberán agregar los datos sensibles del medio de pago. En este caso hay que llamar a getPaymentValuesPCI():
```javascript
var parameters = {
	 	........................................................
		'Operation':'Compra', // Tipo de transacción que se realizará. MANDATORIO. Valores posibles(Compra; Anulacion; Devolucion).
		'USUARIO':'usuaariowebservice', //Nombre del usuario WebService habilitado para realizar esta operación, debe ser solicitado al área de HelpDesk. MANDATORIO. Alfanumérico de 10 caracteres.
		'PASSWORD':'yiuue5y3hhdjer784673yuueojjjd83ye', //Contraseña del usuario WebService habilitado para realizar esta operación. MANDATORIO. Alfanumérico de 32 caracteres.
		'NOMBREENTARJETA':'Juan Perez', //Nombre en tarjeta del tarjetahabiente. MANDATORIO. 
		'NROTARJETA':'382974323847234', //Número de tarjeta. MANDATORIO. Sin espacios ni guiones.
		'VENTARJETA' : 0316, //Fecha de vencimiento de la tarjeta. MANDATORIO. Formato MMYY.
		'CODSEGURIDAD' : '0034', // Código de seguridad de la tarjeta. MADATORIO. Numérico.
		'TIPODOC' : '1', //Identificador del tipop de documento. NO MANDATORIO. (DNI:1, CI:2, LE:3, LC:4). Numérico.
		'NRODOC' : '257xx777', //Número de documento del tarjetahabiente. NO MANDATORIO. Numérico.
		'CALLE' : 'Salta', //Calle donde el tarjetahabiente recibe el resumen de la tarjeta. NO MANDATORIO. Varchar 30 máximo.
		'NROPUERTA' : '153', //Númemro de puerta donde recibe el resumen el tarjetahabiente. NO MANDATORIO. Numérico, máximo 6. 
		'FECHANACIMIENTO' : '06051977', // Fecha de nacimineto del tarjetahabiente. NO MANDATORIO. Formato DDMMYYY
		.........................................................
}
```
[<sub>Volver a inicio</sub>](#inicio)

<a name="cybersource"></a>
## Integración con CyberSource
Para el envío de información adicional para control de fraude, el comercio debe pertenecer a alguno de los siguientes rubros:

 * [Generales a todos los rubros] (#generales)
 * [Retail](#retail)
 * [Travel](#travel)
 * [Servicios] (#servicios) 
 * [Bienes Digitales](#bienesdigitales)
 * [Ticketing](#ticketing)

<a name="generales"></a>
##### Parámetros Adicionales en el post inicial comunes a todos los rubros:
```javascript
var parameters = {
	...........................................................................
	'CSBTCITY':'Villa General Belgrano', //Ciudad de facturación, MANDATORIO.
	'CSBTCOUNTRY':'AR', //País de facturación. MANDATORIO. Código ISO. (http://apps.cybersource.com/library/documentation/sbc/quickref/countries_alpha_list.pdf)
	'CSBTCUSTOMERID':'453458', //Identificador del usuario al que se le emite la factura. MANDATORIO. No puede contener un correo electrónico.
	'CSBTIPADDRESS':'192.0.0.4', //IP de la PC del comprador. MANDATORIO.
	'CSBTEMAIL':'decidir@hotmail.com', //Mail del usuario al que se le emite la factura. MANDATORIO.
	'CSBTFIRSTNAME':'Juan' ,//Nombre del usuario al que se le emite la factura. MANDATORIO.
	'CSBTLASTNAME':'Perez', //Apellido del usuario al que se le emite la factura. MANDATORIO.
	'CSBTPHONENUMBER':'541160913988', //Teléfono del usuario al que se le emite la factura. No utilizar guiones, puntos o espacios. Incluir código de país. MANDATORIO.
	'CSBTPOSTALCODE':' C1010AAP', //Código Postal de la dirección de facturación. MANDATORIO.
	'CSBTSTATE':'B', //Provincia de la dirección de facturación. MANDATORIO. Ver tabla anexa de provincias.
	'CSBTSTREET1':'Cerrito 740', //Domicilio de facturación (calle y nro). MANDATORIO.
	'CSBTSTREET2':'Piso 8', //Complemento del domicilio. (piso, departamento). NO MANDATORIO.
	'CSPTCURRENCY':'ARS', //Moneda. MANDATORIO.
	'CSPTGRANDTOTALAMOUNT':'125.38', //Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO. (Ejemplos:$125,38-> 125.38 $12-> 12 o 12.00)
	'CSMDD6':'Mobile', // Canal de venta. NO MANDATORIO. (Valores posibles: Web, Mobile, Telefonica)
	'CSMDD7':'', // Fecha registro comprador(num Dias). NO MANDATORIO.
	'CSMDD8'.'Y', //Usuario Guest? (Y/N). En caso de ser Y, el campo CSMDD9 no deberá enviarse. NO MANDATORIO.
	'CSMDD9':'', //Customer password Hash: criptograma asociado al password del comprador final. NO MANDATORIO.
	'CSMDD10':'', //Histórica de compras del comprador (Num transacciones). NO MANDATORIO.
	'CSMDD11':'', //Customer Cell Phone. NO MANDATORIO
}
```

<a name="retail"></a>
##### Parámetros Adicionales en el post inicial para el rubro RETAIL
```javascript
var parameters = {
	...........................................................
	'STCITY':'rosario', //Ciudad de enví­o de la orden. MANDATORIO.
	'STCOUNTRY':'', //País de envío de la orden. MANDATORIO.
	'STEMAIL':'jose@gmail.com', //Mail del destinatario, MANDATORIO.
	'STFIRSTNAME':'Jose', //Nombre del destinatario. MANDATORIO.
	'STLASTNAME':'Perez', //Apellido del destinatario. MANDATORIO.
	'STPHONENUMBER':'541155893737', //Número de teléfono del destinatario. MANDATORIO.
	'STPOSTALCODE':'1414', //Código postal del domicilio de envío. MANDATORIO.
	'STSTATE':'D', //Provincia de envío. MANDATORIO. Son de 1 caracter
	'STSTREET1':'San Martín 123', //Domicilio de envío. MANDATORIO.
	'STSTREET2':'San Luis', //Localidad de envío. NO MANDATORIO.
	'CSMDD12':'',//Shipping DeadLine (Num Dias). NO MADATORIO.
	'CSMDD13':'',//Método de Despacho. NO MANDATORIO.
	'CSMDD14':'',//Customer requires Tax Bill ? (Y/N). NO MANDATORIO.
	'CSMDD15':'',//Customer Loyality Number. NO MANDATORIO. 
	'CSMDD16':'',//Promotional / Coupon Code. NO MANDATORIO. 
	//Retail: datos a enviar por cada producto, los valores deben estar separado con #:
	'CSITPRODUCTCODE':'electronic_good', //Código de producto. CONDICIONAL. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)
	'CSITPRODUCTDESCRIPTION':'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Descripción del producto. CONDICIONAL.
	'CSITPRODUCTNAME':'NOTEBOOK L845 SP4304LA DF TOSHIBA', //Nombre del producto. CONDICIONAL.
	'CSITPRODUCTSKU':'LEVJNSL36GN', //Código identificador del producto. CONDICIONAL.
	'CSITTOTALAMOUNT':'1254.40', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. CONDICIONAL.
	'CSITQUANTITY':'1', //Cantidad del producto. CONDICIONAL.
	'CSITUNITPRICE':'1,254.40', //Formato Idem CSITTOTALAMOUNT. CONDICIONAL.
	...........................................................
}
```

<a name="travel"></a>
##### Parámetros Adicionales en el post inicial para el rubro TRAVEL:
```javascript
var parameters = {
	..............................................................................
	'CSDMCOMPLETEROUTE':'JFK-SFO:SFO-LAX', //Ruta completa del viaje, ORIG1-DEST1[:ORIG2-DEST2...:ORIGn-DESTn]. MANDATORIO.
	'CSDMJOURNEYTYPEY':'round trip', //Tipo de viaje. valores posibles: round trip o one way. MANDATORIO.
	'CSDMDEPARTUREDATETIME':'2011-03-20 11:30pm GMT', /*Fecha y hora del primer tramo del viaje. Utilizar GMT.
							    Formato: yyyy-MM-dd hh:mma z donde: 
							    hh = hora en formato 12-horas
							    a = am o pm
							    z = huso horario del vuelo de salida. Por ejemplo, time zone of the departing flight, for
							    example: Si la compaÃ±Ã­a tiene su sede en la ciudad de A, pero el vuelo sale de la ciudad B, z es el horario de la ciudad B al momento de la salida
							    MANDATORIO*/
	'CSADNUMBEROFPASSENGERS':'4', //Cantidad total de pasajeros. MANDATORIO.
	'CSMDD17':'AWHWNV', //Código de Reserva (PNR). MANDATORIO. 
	'CSMDD18':'', //3rd Party Booking? (Y/N). MANDATORIO.
	'CSMDD19':'', //Departure City. NO MANDATORIO.
	'CSMDD20':'', //Final Destination City. NO MANDATORIO.
	'CSMDD21':'', //International Flight. NO MANDATORIO.
	'CSMDD22':'', //Frequent Flyer Number. NO MANDATORIO.
	'CSMDD23':'', //Class of Service. NO MANDATORIO.
	'CSMDD24':'', //Day of week of Flight. NO MANDATORIO.
	'CSMDD25':'', //Week of year of Flight. NO MANDATORIO.
	'CSMDD26':'', //Airline Code. NO MANDATORIO.
	'CSMDD27':'', //Code Share. NO MANDATORIO.
	//Travel: datos a enviar por cada pasajero, los valores deben estar separado con #:
	'CSITPASSENGEREMAIL':'jperez@hotmail.com', //Email del pasajero. CONDICIONAL.
	'CSITPASSENGERFIRSTNAME':'Juan', //Nombre del pasajero. CONDICIONAL.
	'CSITPASSENGERID':'21457547', //Número de pasaporte. NO MANDATORIO.
	'CSITPASSENGERLASTNAME':'Perez', //Apellido del pasajero. CONDICIONAL.
	'CSITPASSENGERPHONE':'541160913988', //Número de teléfono del pasajero. CONDICIONAL.
	'CSITPASSENGERSTATUS':'gold', //Clasificación del pasajero dentro de la empresa. CONDICIONAL.
	'CSITPASSENGERTYPE':'INF', //Tipo de pasajero asociado al precio del pasaje. CONDICIONAL.(ADT: Adult,CNN: Child,INF: Infant,YTH: Youth,STU: Student,SCR: Senior Citizen,MIL: Military)

}

```
<a name="ticketing"></a>
##### Parámetros Adicionales en el post inicial para el rubro TICKETING:
```javascript
var parameters = {
	.............................................................................
	'CSMDD33':'', //
	'CSMDD34':'', //
	//Ticketing, datos a enviar por cada ticket , los valores deben estar separado con “#”:
	'CSITPRODUCTCODE':'',//Código del producto. CONDICIONAL.
	'CSITPRODUCTDESCRIPTION':'',//Descripción del producto. CONDICIONAL.
	'CSITPRODUCTNAME':'' ,//Nombre del producto. CONDICIONAL.
	'CSITPRODUCTSKU':'', //Código identificador del producto. CONDICIONAL.
	'CSITTOTALAMOUNT':'', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY. "999999[.CC]". Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. CONDICIONAL.
	'CSITQUANTITY':'1', //Cantidad del producto. CONDICIONAL.
	'CSITUNITPRICE':'125.38',// Formato Idem CSITTOTALAMOUNT. CONDICIONAL.
}
```

<a name="servicios"></a>
##### Parámetros Adicionales en el post inicial para el rubro SERVICIOS:
```javascript
var parameters = {
	'CSMDD28':'Gas', //Tipo de Servicio. MANDATORIO. Valores posibles: Luz, Gas, Telefono, Agua, TV, Cable, Internet, Impuestos.
	'CSMDD29':'', //Referencia de pago del servicio 1. MANDATORIO.
	'CSMDD30':'', //Referencia de pago del servicio 2. MANDATORIO.
	'CSMDD31':'', //Referencia de pago del servicio 3. MANDATORIO.
	.............................................................................
	//Services, datos a enviar por cada servicio, los valores deben estar separado con “#”:
	'CSITPRODUCTCODE':'', //Código del servicio. MANDATORIO.
	'CSITPRODUCTDESCRIPTION':'', //Descripción del servicio. MANDATORIO.
	'CSITPRODUCTNAME':'', //Nombre del servicio. MANDATORIO.
	'CSITPRODUCTSKU':'LEVJNSL36GN', //Código identificador del servicio. MANDATORIO.
	'CSITTOTALAMOUNT':'', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY. "999999[.CC]". Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. CONDICIONAL.
	'CSITQUANTITY':'1', //Cantidad del producto. CONDICIONAL.
	'CSITUNITPRICE':'125.38',// Formato Idem CSITTOTALAMOUNT. CONDICIONAL.
}
```
<a name="bienesdigitales"></a>
##### Parámetros Adicionales en el post inicial para el rubro BIENES DIGITALES:
```javascript
var parameters = {
	'CSMDD31':'', //Tipo de delivery. MANDATORIO. Valores posibles: WEB Session, Email, SmartPhone
	.............................................................................
	//Services, datos a enviar por cada servicio, los valores deben estar separado con “#”:
	'CSITPRODUCTCODE':'', //Código del servicio. CONDICIONAL.
	'CSITPRODUCTDESCRIPTION':'', //Descripción del servicio. CONDICIONAL.
	'CSITPRODUCTNAME':'', //Nombre del servicio. CONDICIONAL.
	'CSITPRODUCTSKU':'LEVJNSL36GN', //Código identificador del servicio. CONDICIONAL.
	'CSITTOTALAMOUNT':'', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY. "999999[.CC]". Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. CONDICIONAL.
	'CSITQUANTITY':'1', //Cantidad del producto. NO MANDATORIO.
	'CSITUNITPRICE':'125.38',// Formato Idem CSITTOTALAMOUNT. MANDATORIO.
}
```
[<sub>Volver a inicio</sub>](#inicio)
<a name="ejemplo"></a>
## Ejemplo
Existe un ejemplo en la carpeta https://github.com/decidir/sdk-php/ejemplo que muestra los resultados de los 3 métodos principales del SDK.

<a name="test"></a>
## Modo Test
Para utlilizar el modo test se debe pasar un end point de prueba (provisto por DECIDIR SPS).

```php
var options = {
	wsdl : 'https://200.69.248.51:8443/services/t/decidir.net/Authorize?wsdl',
	endpoint : "https://200.69.248.51:8443/services/t/decidir.net/Authorize",	
}; // End Point (para Tests) y wsdl provisto por DECIDIR SPS;
```
[<sub>Volver a inicio</sub>](#inicio)

<a name="tablas"></a>
## Tablas de Referencia
######[Medios de pago](#mdp)
######[Códigos de Estado](#cde)
######[Provincias](#p)

<a name="mdp"></a>
<p>Medios de Pago</p>
<table>
<tr><th>MEDIODEPAGO</th><th>NOMBRE</th><tr>
<tr><td>1</td><td>VISA</td></tr>
<tr><td>6</td><td>AMEX</td></tr>
<tr><td>8</td><td>DINERS</td></tr>
<tr><td>15</td><td>MASTERCARD</td></tr>
<tr><td>20</td><td>MASTERCARD TEST</td></tr>
<tr><td>23</td><td>TARJETA SHOPPING</td></tr>
<tr><td>24</td><td>TARJETA NARANJA</td></tr>
<tr><td>25</td><td>PAGO FACIL</td></tr>
<tr><td>26</td><td>RAPIPAGO</td></tr>
<tr><td>27</td><td>CABAL</td></tr>
<tr><td>29</td><td>ITALCRED</td></tr>
<tr><td>30</td><td>ARGENCARD</td></tr>
<tr><td>31</td><td>VISA DEBITO</td></tr>
<tr><td>34</td><td>COOPEPLUS</td></tr>
<tr><td>36</td><td>ARCASH</td></tr>
<tr><td>37</td><td>NEXO</td></tr>
<tr><td>38</td><td>CREDIMAS</td></tr>
<tr><td>39</td><td>NEVADA</td></tr>
<tr><td>41</td><td>PAGOMISCUENTAS</td></tr>
<tr><td>42</td><td>NATIVA</td></tr>
<tr><td>43</td><td>TARJETA MAS/CENCOSUD</td></tr>
<tr><td>44</td><td>CETELEM</td></tr>
<tr><td>45</td><td>NACIONPYMES</td></tr>
<tr><td>46</td><td>PAYSAFECARD</td></tr>
<tr><td>47</td><td>MONEDERO ONLINE</td></tr>
<tr><td>48</td><td>CAJA DE PAGOS</td></tr>
</table>

<a name="cde"></a>
<p>Codigos de Estado</p>
<table>
<tr><th>IdEstado</th><th>Descripción</th></tr>
<tr><td>1</td><td>Ingresada</td></tr>
<tr><td>2</td><td>A procesar</td></tr>
<tr><td>3</td><td>Procesada</td></tr>
<tr><td>4</td><td>Autorizada</td></tr>
<tr><td>5</td><td>Rechazada</td></tr>
<tr><td>6</td><td>Acreditada</td></tr>
<tr><td>7</td><td>Anulada</td></tr>
<tr><td>8</td><td>Anulación Confirmada</td></tr>
<tr><td>9</td><td>Devuelta</td></tr>
<tr><td>10</td><td>Devolución Confirmada</td></tr>
<tr><td>11</td><td>Pre autorizada</td></tr>
<tr><td>12</td><td>Vencida</td></tr>
<tr><td>13</td><td>Acreditación no cerrada</td></tr>
<tr><td>14</td><td>Autorizada *</td></tr>
<tr><td>15</td><td>A reversar</td></tr>
<tr><td>16</td><td>A registar en Visa</td></tr>
<tr><td>17</td><td>Validación iniciada en Visa</td></tr>
<tr><td>18</td><td>Enviada a validar en Visa</td></tr>
<tr><td>19</td><td>Validada OK en Visa</td></tr>
<tr><td>20</td><td>Recibido desde Visa</td></tr>
<tr><td>21</td><td>Validada no OK en Visa</td></tr>
<tr><td>22</td><td>Factura generada</td></tr>
<tr><td>23</td><td>Factura no generada</td></tr>
<tr><td>24</td><td>Rechazada no autenticada</td></tr>
<tr><td>25</td><td>Rechazada datos inválidos</td></tr>
<tr><td>28</td><td>A registrar en IdValidador</td></tr>
<tr><td>29</td><td>Enviada a IdValidador</td></tr>
<tr><td>32</td><td>Rechazada no validada</td></tr>
<tr><td>38</td><td>Timeout de compra</td></tr>
<tr><td>50</td><td>Ingresada Distribuida</td></tr>
<tr><td>51</td><td>Rechazada por grupo</td></tr>
<tr><td>52</td><td>Anulada por grupo</td></tr>
</table>

<a name="p"></a>
<p>Provincias</p>
<table>
<tr><th>Provincia</th><th>Código</th></tr>
<tr><td>CABA</td><td>C</td></tr>
<tr><td>Buenos Aires</td><td>B</td></tr>
<tr><td>Catamarca</td><td>K</td></tr>
<tr><td>Chaco</td><td>H</td></tr>
<tr><td>Chubut</td><td>U</td></tr>
<tr><td>Córdoba</td><td>X</td></tr>
<tr><td>Corrientes</td><td>W</td></tr>
<tr><td>Entre Ríos</td><td>R</td></tr>
<tr><td>Formosa</td><td>P</td></tr>
<tr><td>Jujuy</td><td>Y</td></tr>
<tr><td>La Pampa</td><td>L</td></tr>
<tr><td>La Rioja</td><td>F</td></tr>
<tr><td>Mendoza</td><td>M</td></tr>
<tr><td>Misiones</td><td>N</td></tr>
<tr><td>Neuquén</td><td>Q</td></tr>
<tr><td>Río Negro</td><td>R</td></tr>
<tr><td>Salta</td><td>A</td></tr>
<tr><td>San Juan</td><td>J</td></tr>
<tr><td>San Luis</td><td>D</td></tr>
<tr><td>Santa Cruz</td><td>Z</td></tr>
<tr><td>Santa Fe</td><td>S</td></tr>
<tr><td>Santiago del Estero</td><td>G</td></tr>
<tr><td>Tierra del Fuego</td><td>V</td></tr>
<tr><td>Tucumán</td><td>T</td></tr>
</table>
[<sub>Volver a inicio</sub>](#inicio)
