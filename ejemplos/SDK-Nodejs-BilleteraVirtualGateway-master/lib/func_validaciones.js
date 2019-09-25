var helper = require('../lib/helper');
var jsonValidaciones = require(__dirname + '/validations.json'); // 01/06 Agregado por AA
var postalcodes_hash = require('./postalCodes.json');

function validateAndFormat(data, validaciones) {
    var result = data;
    for(index in validaciones.validate){
      var validacion = validaciones.validate[index];
      //valido la informacion... si no es valida arroja excepcion
      var result = helper.execValidateFunction(data, validacion);
      if(result==undefined){
        console.warn("se piso data en " + validacion.function + " " + data);
      }
    }
    for(index in validaciones.format){
      var format = validaciones.format[index];
      //valido la informacion... si no es valida arroja excepcion
      //console.log(result + " " + format.function);
      var result = helper.execFormatFunction(result, format);
      //console.log(result);
      if(result==undefined){
        console.warn("se piso data en " + format.function + " " + data);
      }
    }

    return result;
}

function verifyRequired(encontre, validacion){
  // si no lo enconre yes reqerido arojo excepcion
  if (!encontre && validacion.required == 1) {
      helper.buildError("El campo " + validacion.field + " es requerido","");
      throw new Error(error);
  }
}

function validations(fraudControl) {
    var payload = {};
    for (var i in jsonValidaciones) { // recorro las validaciones del json
        var validacion = jsonValidaciones[i];
        try {
            var encontre = false;
            for (var keyCsData in fraudControl) { // RECORRE LOS CAMPOS PROVEÍDOS POR EL USUARIO
                if (keyCsData == validacion.field) {
                    var encontre = true;
                    //console.log("mando a validar " + keyCsData);
                    payload[keyCsData] = validateAndFormat(fraudControl[keyCsData], validacion); //hago los formateos
                }
            }
            verifyRequired(encontre, validacion); //verifico si es requerido que este
        } catch (err) {
            try{
              payload['error'] = JSON.parse(err.message);
            }catch(err){
              console.log(err.message);
              console.log(err.stack);
            }
        }
    }
    return payload;
}

exports.validations = validations;
