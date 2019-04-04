<a name="inicio"></a>		
Todo Pago - módulo SDK-NodeJS para conexión con gateway de pago		
=======

 + [Instalación](#instalacion)
 	+ [Versiones de Node soportadas](#versionesdenodesoportadas)
 	+ [Generalidades](#general)
 + [Uso](#uso)		
    + [Inicializar la clase correspondiente al conector (todo-pago.js)](#initconector)
    + [Solicitud de autorización](#solicitudautorizacion)
    + [Confirmación de transacción](#confirmatransaccion)
    + [Ejemplo](#ejemplo)
    + [Modo test](#test)
 + [Datos adicionales para prevención de fraude](#datosadicionales) 
    + [Datos de referencia](#datosreferencia) 
 + [Características](#caracteristicas)
    + [Status de la operación](#status)
    + [Consulta de operaciones por rango de tiempo](#statusdate)
    + [Devolucion](#devoluciones)
    + [Devolucion parcial](#devolucionparcial)
    + [Formulario hibrido](#formhidrido)
    + [Obtener Credenciales](#credenciales)
    + [Máximo de cuotas a mostrar en formulario](#maxcuotas)
 + [Diagrama de secuencia](#secuencia)
 + [Tablas de referencia](#tablareferencia)		
 + [Tabla de errores](#codigoerrores)	


<a name="instalacion"></a>		
## Instalación	
Se debe descargar la última versión desde del botón Download ZIP o desde https://github.com/TodoPago/sdk-nodejs/archive/master.zip.
Una vez descargado y descomprimido, debe incluirse el archivo todo-pago.js como modulo del proyecto.

Instalar con [npm](http://github.com/isaacs/npm):

```
  npm install todo-pago
```
<br />
[<sub>Volver a inicio</sub>](#inicio)

<a name="versionesdenodesoportadas"></a>		
#### Versiones de node soportadas
La versi&oacute;n implementada de la SDK, esta testeada para versiones desde Node 0.10.x en adelante.
<br />
[<sub>Volver a inicio</sub>](#inicio)

<a name="general"></a>
#### Generalidades
Esta versión soporta únicamente pago en moneda nacional argentina (CURRENCYCODE = 32).
</br>
[<sub>Volver a inicio</sub>](#inicio)



<a name="uso"></a>		
## Uso	
<a name="initconector"></a>	
#### Inicializar la clase correspondiente al conector (todo-pago.js) 
- Importar el modulo: 
   ```nodejs
   var sdk = require('../lib/todo-pago');
   ```
- crear dos objetos (uno de configuración y el otro con los parametros) 
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
</br>
[<sub>Volver a inicio</sub>](#inicio)

<a name="solicitudautorizacion"></a>
#### Solicitud de autorización
- En este caso hay que llamar a sendAuthorizeRequest(), el resultado se obtendra mediante la funcion callback: 		
```nodejs	
var parameters = {
		'Session': 'ABCDEF-1234-12221-FDE1-00000200',
		'Security':'f3d8b72c94ab4a06be2ef7c95490f7d3',
		'EncodingMethod':'XML',
		'Merchant':2153,
		'URL_OK':'http,//someurl.com/ok/',
		'URL_ERROR':'http,//someurl.com/fail/'	
	};


var payload = {
		//operation:
		'MERCHANT': "2153",
		'OPERATIONID':"8000",
		'CURRENCYCODE': 032,
		'AMOUNT':"1.00",
	};

var callback = function(result, err){
	console.log(result);
	console.log(err);
}
sdk.sendAutorizeRequest(options, parameters, payload, callback);		
```	
<br/>

<ins><strong>datos propios del comercio</strong></ins>
</br>
[<sub>Volver a inicio</sub>](#inicio)

<a name="confirmatransaccion"></a>
#### Confirmación de transacción
- En este caso hay que llamar a getAuthorizeAnswer(), enviando como parámetro un objeto como se describe a continuación.		
```nodejs		
var parameters = {
		'Security'   : 'f3d8b72c94ab4a06be2ef7c95490f7d3', 
		'Merchant' 	 : '2153',
		'RequestKey' : '710268a7-7688-c8bf-68c9-430107e6b9da',
		'AnswerKey'  : '693ca9cc-c940-06a4-8d96-1ab0d66f3ee6'
	};
	
sdk.getAutorizeAnswer(options, parameters, function(result, err){
		console.log("getAutorizeAnswer");
		console.log(result);
		console.log(err);
		console.log("-------------------");
	});


```		
<strong><ins>*Importante:</ins></strong>El campo AnswerKey se adiciona  en la redireccion que se realiza a alguna de las direcciones ( URL ) epecificadas en el  servicio SendAurhorizationRequest, esto sucede cuando la transaccion ya fue resuelta y es necesario regresar al Site para finalizar la transaccion de pago, tambien se adiciona el campo Order, el cual tendra el contenido enviado en el campo OPERATIONID. para nuestro ejemplo: <strong>http://susitio.com/paydtodopago/ok?Order=27398173292187&Answer=1111-2222-3333-4444-5555-6666-7777</strong>		
		
Este método devuelve el resumen de los datos de la transacción.		
<br />	
[<sub>Volver a inicio</sub>](#inicio)


<a name="ejemplo"></a>		
#### Ejemplo	
- Existe un ejemplo en la carpeta https://github.com/TodoPago/SDK-Node.js/tree/master/ejemplo que muestra los resultados de los métodos principales del SDK.
- Para ejecutar este ejemplo correr la linea de comando npm install y luego ejecutar node ejemplo.js

</br>
[<sub>Volver a inicio</sub>](#inicio)

<a name="test"></a>		
#### Modo test	
- Para utlilizar el modo test se debe pasar un end point de prueba (provisto por TODO PAGO).		
		
```nodejs		
var options = {
	endpoint : "developers",	
	Authorization:'PRISMA f3d8b72c94ab4a06be2ef7c95490f7d3'
}; // End Point = "developers" para test	
```
</br>
[<sub>Volver a inicio</sub>](#inicio)



<a name="datosadicionales"></a>		
## Datos adicionales para prevención de fraude
##### Parámetros Adicionales en el post inicial:		
```nodejs		
var payload = {		
'CSBTCITY':'Villa General Belgrano', //Ciudad de facturación, MANDATORIO.		
'CSBTCOUNTRY':'AR', //País de facturación. MANDATORIO. Código ISO. (http://apps.cybersource.com/library/documentation/sbc/quickref/countries_alpha_list.pdf)		
'CSBTCUSTOMERID':'453458', //Identificador del usuario al que se le emite la factura. MANDATORIO. No puede contener un correo electrónico.		
'CSBTIPADDRESS':'192.0.0.4', //IP de la PC del comprador. MANDATORIO.		
'CSBTEMAIL':'some@someurl.com', //Mail del usuario al que se le emite la factura. MANDATORIO.		
'CSBTFIRSTNAME':'Juan' ,//Nombre del usuario al que se le emite la factura. MANDATORIO.		
'CSBTLASTNAME':'Perez', //Apellido del usuario al que se le emite la factura. MANDATORIO.		
'CSBTPHONENUMBER':'541160913988', //Teléfono del usuario al que se le emite la factura. No utilizar guiones, puntos o espacios. Incluir código de país. MANDATORIO.		
'CSBTPOSTALCODE':'1010', //Código Postal de la dirección de facturación. MANDATORIO.		
'CSBTSTATE':'B', //Provincia de la dirección de facturación. MANDATORIO. Ver tabla anexa de provincias.		
'CSBTSTREET1':'Some Street 2153', //Domicilio de facturación (calle y nro). MANDATORIO.		
'CSBTSTREET2':'Piso 8', //Complemento del domicilio. (piso, departamento). NO MANDATORIO.		
'CSPTCURRENCY':'ARS', //Moneda. MANDATORIO.		
'CSPTGRANDTOTALAMOUNT':'125.38', //Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO. (Ejemplos:$125,38-> 125.38 $12-> 12 o 12.00)		
'CSMDD7':'', // Fecha registro comprador(num Dias). NO MANDATORIO.		
'CSMDD8':'', //Usuario Guest? (Y/N). En caso de ser Y, el campo CSMDD9 no deberá enviarse. NO MANDATORIO.		
'CSMDD9':'', //Customer password Hash: criptograma asociado al password del comprador final. NO MANDATORIO.		
'CSMDD10':'', //Histórica de compras del comprador (Num transacciones). NO MANDATORIO.		
'CSMDD11':'', //Customer Cell Phone. NO MANDATORIO.	

//Retail
'CSSTCITY':'Villa General Belgrano', //Ciudad de enví­o de la orden. MANDATORIO.		
'CSSTCOUNTRY':'', //País de envío de la orden. MANDATORIO.		
'CSSTEMAIL':'some@someurl.com', //Mail del destinatario, MANDATORIO.		
'CSSTFIRSTNAME':'Jose', //Nombre del destinatario. MANDATORIO.		
'CSSTLASTNAME':'Perez', //Apellido del destinatario. MANDATORIO.		
'CSSTPHONENUMBER':'541155893737', //Número de teléfono del destinatario. MANDATORIO.		
'CSSTPOSTALCODE':'1010', //Código postal del domicilio de envío. MANDATORIO.		
'CSSTSTATE':'B', //Provincia de envío. MANDATORIO. Son de 1 caracter		
'CSSTSTREET1':'Some Street 2153', //Domicilio de envío. MANDATORIO.		
'CSMDD12':'',//Shipping DeadLine (Num Dias). NO MADATORIO.		
'CSMDD13':'',//Método de Despacho. NO MANDATORIO.		
'CSMDD14':'',//Customer requires Tax Bill ? (Y/N). NO MANDATORIO.		
'CSMDD15':'',//Customer Loyality Number. NO MANDATORIO. 		
'CSMDD16':'',//Promotional / Coupon Code. NO MANDATORIO. 		
//Datos a enviar por cada producto, los valores deben estar separado con #:		
'CSITPRODUCTCODE':'electronic_good', //Código de producto. CONDICIONAL. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)		
'CSITPRODUCTDESCRIPTION':'Test Prd Description', //Descripción del producto. CONDICIONAL.		
'CSITPRODUCTNAME':'TestPrd', //Nombre del producto. CONDICIONAL.		
'CSITPRODUCTSKU':'SKU1234', //Código identificador del producto. CONDICIONAL.		
'CSITTOTALAMOUNT':'10.01', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. CONDICIONAL.		
'CSITQUANTITY':'1', //Cantidad del producto. CONDICIONAL.		
'CSITUNITPRICE':'10.01', //Formato Idem CSITTOTALAMOUNT. CONDICIONAL.			
	...........................................................		
```
[<sub>Volver a inicio</sub>](#inicio)	

<a name="datosreferencia"></a>    
#### Datos de referencia   

<table style="max-width:200px;">
<tr><th>Nombre del campo</th><th>Required/Optional</th><th>Data Type</th><th>Data TypeMínimo</th><th>Comentarios</th></tr>
<tr><td style="max-width:200px;">CSBTCITY</td><td>Required</td><td>String (50)</td><td>1</td><td>Ciudad / Debe comenzar con una letra</td></tr>
<tr><td>CSBTCOUNTRY</td><td>Required</td><td>String (2)</td><td>1</td><td>Código <a href="http://apps.cybersource.com/library/documentation/sbc/quickref/countries_alpha_list.pdf">ISO</a></td></tr>
<tr><td> CSBTCUSTOMERID</td><td>Required</td><td>String (50)</td><td>1</td><td>Identificador del usuario unico logueado al portal (No puede ser una direccion de email)</td></tr><td>
<tr><td> CSBTEMAIL</td><td>Required</td><td>String (100)</td><td>1</td><td>Correo electrónico del comprador con formato válido (solo letras (a-z), números, puntos y sin espacios).</td></tr>
<tr><td>CSBTFIRSTNAME</td><td>Required</td><td>String (60)</td><td>1</td><td>Nombre del tarjeta habiente / Sin caracteres especiales como acentos invertidos, sólo letras, números y espacios</td></tr>
<tr><td>CSBTIPADDRESS</td><td>Required</td><td>String (15)</td><td>1</td><td>"End Customer´s IP address, such as 10.1.27.63, reported by your Web server via socket information."</td></tr>
<tr><td> CSBTLASTNAME</td><td>Required</td><td>String (60)</td><td>1</td><td>Apellido del tarjetahabiente / Sin caracteres especiales como acentos invertidos, sólo letras, números y espacios</td></tr> <td>
<tr><td>CSBTPHONENUMBER</td><td>Required</td><td>String (15)</td><td>6</td><td>Número de telefono</td></tr>
<tr><td>CSBTPOSTALCODE</td><td>Required</td><td>String (10)</td><td>1</td><td>Codigo Postal</td></tr> 
<tr><td>CSBTSTATE</td><td>Required</td><td>String (2)</td><td>1</td><td>Estado (Si el country = US, el campo se valida para un estado valido en USA)</td></tr>
<tr><td>CSBTSTREET1</td><td>Required</td><td>String (60)</td><td>1</td><td>Calle Numero interior Numero Exterior</td></tr> 
<tr><td>CSBTSTREET2</td><td>Optional</td><td>String (60)</td><td></td><td>Barrio</td></tr>
<tr><td>CSITPRODUCTCODE</td><td>Conditional</td><td>String (255)</td><td></td><td></td> </tr>
<tr><td>CSITPRODUCTDESCRIPTION</td><td>Conditional</td><td>String (255)</td><td></td><td>Descripción general del producto</td></tr> 
<tr><td>CSITPRODUCTNAME</td><td>Conditional</td><td>String (255)</td><td></td><td>Nombre en catalogo del producto</td></tr>
<tr><td>CSITPRODUCTSKU</td><td>Conditional</td><td>String (255)</td><td></td><td>SKU en catalogo</td></tr> 
<tr><td>CSITQUANTITY</td><td>Conditional</td><td>Integer (10)</td><td></td><td>Cantidad productos del mismo tipo agregados al carrito</td></tr> 
<tr><td>CSITTOTALAMOUNT</td><td>Conditional</td><td></td><td></td><td>"Precio total = Precio unitario * quantity / CSITTOTALAMOUNT = CSITUNITPRICE * CSITQUANTITY ""999999.CC"" Es mandatorio informar los decimales, usando el punto como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales."</td></tr>
<tr><td>CSITUNITPRICE</td><td>Conditional</td><td>String (15)</td><td></td><td>"Precio Unitaro del producto / ""999999.CC"" Es mandatorio informar los decimales, usando el punto como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales."</td></tr> 
<tr><td>CSPTCURRENCY</td><td>Required</td><td>String (5)</td><td>1</td><td><a href="http://apps.cybersource.com/library/documentation/sbc/quickref/currencies.pdf">Currencies</a></td></tr> 
<tr><td>CSPTGRANDTOTALAMOUNT</td><td>Required</td><td>Decimal (15)</td><td>1</td><td>"Cantidad total de la transaccion./""999999.CC"" Con decimales obligatorios, usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales."</td></tr> 
<tr><td>CSSTCITY</td><td>Required</td><td>String (50)</td><td>1</td><td>Ciudad / Debe comenzar con una letra</td>
<tr><td> CSSTCOUNTRY</td><td>Required</td><td>String (2)</td><td>1</td><td><a href="http://apps.cybersource.com/library/documentation/sbc/quickref/countries_alpha_list.pdf">Código ISO</a></td></tr>
<tr><td>CSSTEMAIL</td><td>Required</td><td>String (100)</td><td>1</td><td>Correo electrónico del comprador con formato válido (solo letras (a-z), números, puntos y sin espacios).</td></tr> 
<tr><td>CSSTFIRSTNAME</td><td>Required</td><td>String (60)</td><td>1</td><td>Nombre del tarjeta habiente / Sin caracteres especiales como acentos invertidos, sólo letras, números y espacios</td></tr> 
<tr><td>CSSTLASTNAME</td><td>Required</td><td>String (60)</td><td>1</td><td>Apellido del tarjetahabiente / Sin caracteres especiales como acentos invertidos, sólo letras, números y espacios</td></tr> 
<tr><td>CSSTPHONENUMBER</td><td>Required</td><td>String (15)</td><td>6</td><td>"Número de telefono. Cuidar el hecho que por default algunos comercios envían ""54"", contando entonces con 2 de los 6 caracteres requeridos."</td></tr> 
<tr><td>CSSTPOSTALCODE</td><td>Required</td><td>String (10)</td><td>1</td><td>Código Postal</td></tr>
<tr><td>CSSTSTATE</td><td>Required</td><td>String (2)</td><td>1</td><td>Estado (Si el country = US, el campo se valida para un estado v lido en USA)</td><tr> 
<tr><td>CSSTSTREET1</td><td>Required</td><td>String (60)</td><td>1</td><td>Calle Numero interior Numero Exterior / Para los casos que no son de envío a domicilio, jam s enviar la dirección propia del comercio o correo donde se retire la mercadería, en ese caso replicar los datos de facturación.</td></tr>
<tr><td> CSSTSTREET2</td><td>Optional</td><td>String (60)</td><td></td><td>Barrio</td></tr> 
<tr><td>CSMDD1 </td><td>Required</td><td>String (255)</td><td>1</td><td>Incluir numero de comercio proveniente del campo NROCOMERCIO del API DECIDIR</td></tr> 
<tr><td>CSMDD2</td><td>Required</td><td>String (255)</td><td>1</td><td>Incluir el nombre del comercio, Decidir puede obtener este dato del portal de configuracion de comercios</td></tr>
<tr><td> CSMDD3</td><td>Required (Catalogo)</td><td>String (255)</td><td>1</td><td>"Valores ejemplo: (retail, digital goods, services, travel, ticketing) Es recomendable que el API de decidir fije opciones seleccionables y no sean de captura libre para el comercio"</td></tr> 
<tr><td>CSMDD4</td><td>Optional (Catalogo)</td><td>String (255)</td><td></td><td>"Valores ejemplo: (Visa, Master Card, Tarjeta Shopping, Banelco...) Es recomendable que el API de decidir fije opciones seleccionables y no sean de captura libre para el comercio. Se tienen que incluir todos los medios de pago aceptados"</td></tr>
<tr><td> CSMDD5</td><td>Optional</td><td>String (255)</td><td></td><td>Valor numerico que detalle el numero de cuotas</td></tr>
<tr><td>CSMDD6</td><td>Optional (Catalogo)</td><td>String (255)</td><td></td><td>"Valores ejemplo: (Web, Call Center, Mobile, Kiosko) Es recomendable que el API de decidir fije opciones seleccionables y no sean de captura libre para el comercio."</td></tr> 
<tr><td>CSMDD7</td><td>Optional</td><td>String (255)</td><td></td><td>Numero de dias que tiene registrado un cliente en el portal del comercio.</td></tr>
<tr><td>CSMDD8</td><td>Optional</td><td>String (255)</td><td></td><td>Valor Boleano para indicar si el usuario esta comprando como invitado en la pagina del comercio. Valores posibles (S/N)</td></tr> 
<tr><td>CSMDD9</td><td>Optional</td><td>String (255)</td><td></td><td>Valor del password del usuario registrado en el portal del comercio. Incluir el valor en hash</td></tr> 
<tr><td>CSMDD10</td><td>Optional</td><td>String (255)</td><td></td><td>Conteo de transacciones realizadas por el mismo usuario registrado en el portal del comercio</td></tr>
<tr><td>CSMDD11</td><td>Optional</td><td>String (255)</td><td></td><td>Incluir numero de telefono adicional del comprador</td></tr> 
<tr><td>CSMDD12</td><td>Optional</td><td>String (255)</td><td></td><td>Numero de dias que tiene el comercio para hacer la entrega</td></tr> 
<tr><td>CSMDD13</td><td>Optional (Catalogo)</td><td>String (255)</td><td></td><td>"Valores ejemplo: (domicilio, click and collect, carrier) Es recomendable que el API de decidir fije opciones seleccionables y no sean de captura libre para el comercio."</td></tr> 
<tr><td>CSMDD14</td><td>Optional</td><td>String (255)</td><td></td><td>Valor booleano para identificar si el cliente requiere un comprobante fiscal o no S / N</td></tr>
<tr><td>CSMDD15</td><td>Optional</td><td>String (255)</td><td></td><td>Incluir numero de cliente frecuente</td></tr>
<tr><td>CSMDD16</td><td>Optional</td><td>String (255)</td><td></td><td>Incluir numero de cupon de descuento</td></tr>
<tr><td>CSMDD35</td><td>Conditional (Transaccion con Visa)</td><td>String (255)</td><td></td><td>Tipo de documento solicitado por el comercio al cliente</td></tr>
<tr><td>CSMDD36</td><td>Conditional (Transaccion con Visa)</td><td>String (255)</td><td></td><td>Numero de documento solicitado por el comercio al cliente</td></tr>
<tr><td>CSMDD37</td><td>Conditional (Transaccion con Visa)</td><td>String (255)</td><td></td><td>Numero de puerta</td></tr>
<tr><td> CSMDD38</td><td>onditional (Transaccion con Visa)</td><td>String (255)</td><td></td><td>Fecha de nacimiento del comprador, dato solicitado por el comercio. DECIDIR tiene el formato exacto de como se debe de capturar</td></tr>
<tr><td>CSMDD39</td><td>Conditional (Transaccion con Visa)</td><td>String (255)</td><td></td><td>Valor numero correspondiente a la validacion de cada uno de los datos anteriores ejemplo: 1012</td></tr>
<tr><td> CSMDD40</td><td>Optional</td><td>String(1)</td><td></td><td>"Valor para identificar si la transaccion ha sido reportada como fraude por parte del emisor. Incluir el parametro con valor = S Este parametro lo genera decidir a partir de la respuesta del emisor. En caso de una transaccion aceptada por el emisor o con rechazo diferente a fraude, NO INCLUIR"</td></tr> 
<tr><td>CSMDD41</td><td>Optional</td><td>String(1)</td><td></td><td>Datos proporcionado por DECIDIR en el form. De pago. Valores posibles S/N</td></tr> 
<tr><td>CSMDD42</td><td>Optional</td><td>String(1)</td><td></td><td>Datos proporcionado por DECIDIR en el form. De pago. Valores posibles S/N</td></tr>
<tr><td>CSMDD80</td><td>Required </td><td>Integer (20)</td><td></td><td>Número de cuenta del vendedor</td></tr>
<tr><td> CSMDD81</td><td>Required </td><td>String(255)</td><td></td><td>Mail del vendedor en TP</td></tr>
<tr><td> CSMDD82</td><td>Required </td><td>Integer (6)</td><td></td><td>Rubro asignado por el analista de riesgos de Back Office</td></tr>
<tr><td>CSMDD83</td><td>Required </td><td>Integer (2)</td><td></td><td>Antig�edad de la cuenta vendedor</td></tr> 
<tr><td>CSMDD84</td><td>Required </td><td>String (15)</td><td></td><td>Consumidor Final / Profesional / Empresa</td></tr> 
<tr><td>CSMDD85</td><td>Required </td><td>Integer(1)</td><td></td><td>0 (No se le pidió) / 1 (Se le pidió y se validó) / 2 (Uso Futuro)</td></tr>
<tr><td> CSMDD86</td><td>Requerido (para Billetera)</td><td>Integer(20)</td><td></td><td>Número de cuenta del comprador</td></tr>
<tr><td>CSMDD87</td><td>Requerido (para Billetera)</td><td>Integer (3)</td><td></td><td>Antig�edad de la cuenta comprador (Meses)</td></tr> 
<tr><td>CSMDD88</td><td>Requerido (para Billetera)</td><td>Integer (3)</td><td></td><td>Cantidad de tarjetas Habilitadas de la Billetera</td></tr> 
<tr><td>CSMDD89</td><td>Requerido (para Billetera)</td><td>Integer (2)</td><td></td><td>Nivel de Riesgo asignado al Medio de Pago que Utiliza</td></tr>
</table>



<a name="caracteristicas"></a>		
## Características	

<a name="status"></a>		
#### Status de la operación	
- La SDK cuenta con un m&eacute;todo para consultar el status de la transacci&oacute;n desde la misma SDK. El m&eacute;todo se utiliza de la siguiente manera:
```nodejs
sdk.getStatus(options, merchant, operationId, callback);// Merchant es el id site y operationId es el id operación que se envió en el objeto a través del método sendAuthorizeRequest() 
```
- Dicho m&eacute;todo retornara el status actual de la transacci&oacute;n en Todopago.

</br>
[<sub>Volver a inicio</sub>](#inicio)

<a name="statusdate"></a>		
#### Consulta de operaciones por rango de tiempo
En este caso hay que llamar a getByRangeDateTime() y devolvera todas las operaciones realizadas en el rango de fechas dado

```nodejs

	var parameters = {
		'MERCHANT': '2153',
		'STARTDATE': '2015-01-01T17:34:42.903',
		'ENDDATE': '2015-12-10T17:34:42.903'
	};
	
	sdk.getByRangeDateTime(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("GetByRangeDateTime");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
	

```
</br>
[<sub>Volver a inicio</sub>](#inicio)	

<a name="devoluciones"></a>		
#### Devoluciones		
La SDK dispone de métodos para realizar la devolución online, total o parcial, de una transacción realziada a traves de TodoPago.
- Devolución Total
- Se debe llamar al método ```voidRequest``` de la siguiente manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'RequestKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.voidRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("VoidRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
```

- También se puede llamar al método ```voidRequest``` de la esta otra manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'AuthorizationKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.voidRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("VoidRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});

</br>
[<sub>Volver a inicio</sub>](#inicio)	

<a name="devolucionparcial"></a>		
#### Devolucion parcial		
Se debe llamar al método ```returnRequest``` de la siguiente manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'RequestKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.returnRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("ReturnRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
```

También se puede llamar al método ```returnRequest``` de la esta otra manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'AuthorizationKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.returnRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("ReturnRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
```
</br>
[<sub>Volver a inicio</sub>](#inicio)




<a name="formhidrido"></a>		
#### Formulario hibrido	
**Conceptos basicos**<br>
El formulario hibrido, es una alternativa al medio de pago actual por redirección al formulario externo de TodoPago.<br> 
Con el mismo, se busca que el comercio pueda adecuar el look and feel del formulario a su propio diseño.

**Libreria**<br>
El formulario requiere incluir en la pagina una libreria Javascript de TodoPago.<br>
El endpoint depende del entorno:
+ Desarrollo: https://developers.todopago.com.ar/resources/TPHybridForm-v0.1.js
+ Produccion: https://forms.todopago.com.ar/resources/TPHybridForm-v0.1.js

**Restricciones y libertades en la implementación**

+ Ninguno de los campos del formulario podrá contar con el atributo name.
+ Se deberá proveer de manera obligatoria un botón para gestionar el pago con Billetera Todo Pago.
+ Todos los elementos de tipo <option> son completados por la API de Todo Pago.
+ Los campos tienen un id por defecto. Si se prefiere utilizar otros ids se deberán especificar los
mismos cuando se inicialice el script de Todo Pago.
+ Pueden aplicarse todos los detalles visuales que se crean necesarios, la API de Todo Pago no
altera los atributos class y style.
+ Puede utilizarse la API para setear los atributos placeholder del formulario, para ello deberá
especificar dichos placeholders en la inicialización del formulario "window.TPFORMAPI.hybridForm.setItem". En caso de que no se especifiquen los placeholders se usarán los valores por defecto de la API.

**HTML del formulario**

El formulario implementado debe contar al menos con los siguientes campos.

```html
<body>
	<select id="formaDePagoCbx"></select>
	<select id="bancoCbx"></select>
	<select id="promosCbx"></select>
	<label id="labelPromotionTextId"></label>
	<input id="numeroTarjetaTxt"/>
	<input id="mesTxt"/>
	<input id="anioTxt"/>
	<input id="codigoSeguridadTxt"/>
	<label id="labelCodSegTextId"></label>
	<input id="apynTxt"/>
	<select id="tipoDocCbx"></select>
	<input id="nroDocTxt"/>
	<input id="emailTxt"/><br/>
	<button id="MY_btnConfirmarPago"/>
</body>
```

**Inizialización y parametros requeridos**<br>
Para inicializar el formulario se usa window.TPFORMAPI.hybridForm.initForm. El cual permite setear los elementos y ids requeridos.

Para inicializar un ítem de pago, es necesario llamar a window.TPFORMAPI.hybridForm.setItem. Este requiere obligatoriamente el parametro publicKey que corresponde al PublicRequestKey (entregado por el SAR).
Se sugiere agregar los parametros usuario, e-mail, tipo de documento y numero.

**Javascript**
```js
window.TPFORMAPI.hybridForm.initForm({
    callbackValidationErrorFunction: 'validationCollector',
	callbackCustomSuccessFunction: 'customPaymentSuccessResponse',
	callbackCustomErrorFunction: 'customPaymentErrorResponse',
	botonPagarId: 'MY_btnConfirmarPago',
	modalCssClass: 'modal-class',
	modalContentCssClass: 'modal-content',
	beforeRequest: 'initLoading',
	afterRequest: 'stopLoading'
});

window.TPFORMAPI.hybridForm.setItem({
    publicKey: 'taf08222e-7b32-63d4-d0a6-5cabedrb5782', //obligatorio
    defaultNombreApellido: 'Usuario',
    defaultNumeroDoc: 20234211,
    defaultMail: 'todopago@mail.com',
    defaultTipoDoc: 'DNI'
});

//callbacks de respuesta del pago
function validationCollector(parametros) {
}
function customPaymentSuccessResponse(response) {
}
function customPaymentErrorResponse(response) {
}
function initLoading() {
}
function stopLoading() {
}
```

**Callbacks**<br>
El formulario define callbacks javascript, que son llamados según el estado y la informacion del pago realizado:
+ customPaymentSuccessResponse: Devuelve response si el pago se realizo correctamente.
+ customPaymentErrorResponse: Si hubo algun error durante el proceso de pago, este devuelve el response con el codigo y mensaje correspondiente.

**Ejemplo de Implementación**:
<a href="/form_hibrido-ejemplo/index.html" target="_blank">Formulario hibrido</a>
<br>

[<sub>Volver a inicio</sub>](#inicio)

<br>

<a name="maxcuotas"></a>
####Máximo de cuotas a mostrar en formulario
Mediante esta funcionalidad, se permite setear el número máximo de cuotas que se desplegará en el formulario de pago.

Para hacer uso de esta funcionalidad debe agregarse en el parámetro **payload** del método **sendAutorizeRequest** el campo **MAXINSTALLMENTS** con el valor máximo de cuotas a ofrecer (generalmente de 1 a 12)

#####Ejemplo

```nodejs		
payload = {		
	...........................................................................		
	'MAXINSTALLMENTS':"6", //Nro maximo de cuotas a mostrar en el formulario, OPCIONAL.
	...........................................................		
```

[<sub>Volver a inicio</sub>](#inicio)
<br>

<br>
<a name="credenciales"></a>		
#### Obtener Credenciales	
- Los datos como Authorization , merchantId y ApiKey se pueden obtener mediante el metodo getCredentials del objeto User llamada desde el sdk.
- se debe pasar por parametro los datos de ingreso de todoPago (mail y password) en caso de no tener una cuenta podes registrarte en http://www.todopago.com.ar/registrate  y generar tus credenciales en herramientas -> comercios:integración

- un ejemplo esta en ejemplo/ejemplo.js
```
	var email = 'sebastian.macias@gmail.com';
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
</br>
[<sub>Volver a inicio</sub>](#inicio)



<a name="secuencia"></a>		
## Diagrama de secuencia
![imagen de configuracion](https://raw.githubusercontent.com/TodoPago/imagenes/master/README.img/secuencia-page-001.jpg)
</br>
[<sub>Volver a inicio</sub>](#inicio)


<a name="tablareferencia"></a>		
## Tablas de referencia
######[Códigos de Estado](#cde)		
######[Provincias](#p)		
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
<p>Solo utilizado para incluir los datos de control de fraude</p>
<table>		
<tr><th>Provincia</th><th>Código</th></tr>		
<tr><td>CABA</td><td>C</td></tr>		
<tr><td>Buenos Aires</td><td>B</td></tr>		
<tr><td>Catamarca</td><td>K</td></tr>		
<tr><td>Chaco</td><td>H</td></tr>		
<tr><td>Chubut</td><td>U</td></tr>		
<tr><td>Córdoba</td><td>X</td></tr>		
<tr><td>Corrientes</td><td>W</td></tr>		
<tr><td>Entre Ríos</td><td>E</td></tr>		
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
</br>		
[<sub>Volver a inicio</sub>](#inicio)



<a name="codigoerrores"></a>		
## Tabla de errores
<table>		
<tr><th>Id mensaje</th><th>Mensaje</th></tr>				
<tr><td>-1</td><td>Aprobada.</td></tr>
<tr><td>1081</td><td>Tu saldo es insuficiente para realizar la transacción.</td></tr>
<tr><td>1100</td><td>El monto ingresado es menor al mínimo permitido</td></tr>
<tr><td>1101</td><td>El monto ingresado supera el máximo permitido.</td></tr>
<tr><td>1102</td><td>La tarjeta ingresada no corresponde al Banco indicado. Revisalo.</td></tr>
<tr><td>1104</td><td>El precio ingresado supera al máximo permitido.</td></tr>
<tr><td>1105</td><td>El precio ingresado es menor al mínimo permitido.</td></tr>
<tr><td>2010</td><td>En este momento la operación no pudo ser realizada. Por favor intentá más tarde. Volver a Resumen.</td></tr>
<tr><td>2031</td><td>En este momento la validación no pudo ser realizada, por favor intentá más tarde.</td></tr>
<tr><td>2050</td><td>Lo sentimos, el botón de pago ya no está disponible. Comunicate con tu vendedor.</td></tr>
<tr><td>2051</td><td>La operación no pudo ser procesada. Por favor, comunicate con tu vendedor.</td></tr>
<tr><td>2052</td><td>La operación no pudo ser procesada. Por favor, comunicate con tu vendedor.</td></tr>
<tr><td>2053</td><td>La operación no pudo ser procesada. Por favor, intentá más tarde. Si el problema persiste comunicate con tu vendedor</td></tr>
<tr><td>2054</td><td>Lo sentimos, el producto que querés comprar se encuentra agotado por el momento. Por favor contactate con tu vendedor.</td></tr>
<tr><td>2056</td><td>La operación no pudo ser procesada. Por favor intentá más tarde.</td></tr>
<tr><td>2057</td><td>La operación no pudo ser procesada. Por favor intentá más tarde.</td></tr>
<tr><td>2059</td><td>La operación no pudo ser procesada. Por favor intentá más tarde.</td></tr>
<tr><td>90000</td><td>La cuenta destino de los fondos es inválida. Verificá la información ingresada en Mi Perfil.</td></tr>
<tr><td>90001</td><td>La cuenta ingresada no pertenece al CUIT/ CUIL registrado.</td></tr>
<tr><td>90002</td><td>No pudimos validar tu CUIT/CUIL.  Comunicate con nosotros <a href="#contacto" target="_blank">acá</a> para más información.</td></tr>
<tr><td>99900</td><td>El pago fue realizado exitosamente</td></tr>
<tr><td>99901</td><td>No hemos encontrado tarjetas vinculadas a tu Billetera. Podés  adherir medios de pago desde www.todopago.com.ar</td></tr>
<tr><td>99902</td><td>No se encontro el medio de pago seleccionado</td></tr>
<tr><td>99903</td><td>Lo sentimos, hubo un error al procesar la operación. Por favor reintentá más tarde.</td></tr>
<tr><td>99970</td><td>Lo sentimos, no pudimos procesar la operación. Por favor reintentá más tarde.</td></tr>
<tr><td>99971</td><td>Lo sentimos, no pudimos procesar la operación. Por favor reintentá más tarde.</td></tr>
<tr><td>99977</td><td>Lo sentimos, no pudimos procesar la operación. Por favor reintentá más tarde.</td></tr>
<tr><td>99978</td><td>Lo sentimos, no pudimos procesar la operación. Por favor reintentá más tarde.</td></tr>
<tr><td>99979</td><td>Lo sentimos, el pago no pudo ser procesado.</td></tr>
<tr><td>99980</td><td>Ya realizaste un pago en este sitio por el mismo importe. Si querés realizarlo nuevamente esperá 5 minutos.</td></tr>
<tr><td>99982</td><td>En este momento la operación no puede ser realizada. Por favor intentá más tarde.</td></tr>
<tr><td>99983</td><td>Lo sentimos, el medio de pago no permite la cantidad de cuotas ingresadas. Por favor intentá más tarde.</td></tr>
<tr><td>99984</td><td>Lo sentimos, el medio de pago seleccionado no opera en cuotas.</td></tr>
<tr><td>99985</td><td>Lo sentimos, el pago no pudo ser procesado.</td></tr>
<tr><td>99986</td><td>Lo sentimos, en este momento la operación no puede ser realizada. Por favor intentá más tarde.</td></tr>
<tr><td>99987</td><td>Lo sentimos, en este momento la operación no puede ser realizada. Por favor intentá más tarde.</td></tr>
<tr><td>99988</td><td>Lo sentimos, momentaneamente el medio de pago no se encuentra disponible. Por favor intentá más tarde.</td></tr>
<tr><td>99989</td><td>La tarjeta ingresada no está habilitada. Comunicate con la entidad emisora de la tarjeta para verificar el incoveniente.</td></tr>
<tr><td>99990</td><td>La tarjeta ingresada está vencida. Por favor seleccioná otra tarjeta o actualizá los datos.</td></tr>
<tr><td>99991</td><td>Los datos informados son incorrectos. Por favor ingresalos nuevamente.</td></tr>
<tr><td>99992</td><td>La fecha de vencimiento es incorrecta. Por favor seleccioná otro medio de pago o actualizá los datos.</td></tr>
<tr><td>99993</td><td>La tarjeta ingresada no está vigente. Por favor seleccioná otra tarjeta o actualizá los datos.</td></tr>
<tr><td>99994</td><td>El saldo de tu tarjeta no te permite realizar esta operacion.</td></tr>
<tr><td>99995</td><td>La tarjeta ingresada es invalida. Seleccioná otra tarjeta para realizar el pago.</td></tr>
<tr><td>99996</td><td>La operación fué rechazada por el medio de pago porque el monto ingresado es inválido.</td></tr>
<tr><td>99997</td><td>Lo sentimos, en este momento la operación no puede ser realizada. Por favor intentá más tarde.</td></tr>
<tr><td>99998</td><td>Lo sentimos, la operación fue rechazada. Comunicate con la entidad emisora de la tarjeta para verificar el incoveniente o seleccioná otro medio de pago.</td></tr>
<tr><td>99999</td><td>Lo sentimos, la operación no pudo completarse. Comunicate con la entidad emisora de la tarjeta para verificar el incoveniente o seleccioná otro medio de pago.</td></tr>
</table>


[<sub>Volver a inicio</sub>](#inicio)
