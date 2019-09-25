var postalcodes_hash = require('./postalCodes.json');
// La cantidad de arrays dependen del campo CSITPRODUCTDESCRIPTION, si éste desprende elementos de su array,
// los demás CSITPRODUCTxxx van con la misma cantidad de elementos.
// El parámetro str_csitproductdescription se utiliza como referencia para los demás campos que dependen
// de la cantidad de descripciones de los productos (menos de 256 la suma del total de elementos del array)
function csitFormat(str, max) {
    var result = "";
    if (str.length > max) {
        var strings = str.split("#");
        //El tamaño maximo del campo dividido la candidad de palabras me da el tamaño de cada palabra
        //le resto la cantidad de palabras por los #
        var maxForWord = (max / strings.length) - strings.length;
        for (var i in strings) {
            var word = strings[i];
            result += clean(truncate(word, maxForWord)) + "#";
        }
        result = result.substring(0, result.length - 1);
    } else {
        var strings = str.split("#");
        for (var i in strings) {
            var word = strings[i];
            result += clean(word) + "#";
        }
        result = result.substring(0, result.length - 1);
    }
    return result;
}

function word(str, parametro) {
    if (!str.match(/^[\W]*$/)) {
        //console.log('funcion word: '+str+ ' -> ' +parametro);
        return parametro;
    } else {
        buildError(parametro, str);
    }
}


function totalAmount(str, validacion) {
    var regex = new RegExp(validacion.params[0]);
    if (!regex.test(str)) {
        return buildError(validacion.message, str);
    } else {
        return str;
    }
}

//formatea a booleanos a formato valido o infiere N
function booleanFormat(value, validacion) {

    if (!value.match(/^[YySsNn]$/)) {
        if (validacion.default) {
            return validacion.default;
        } else {
            buildError(validacion.message, value);
        }
    } else {
        return value;
    }
}

//infiere formatos de telefono valido
function phoneSanitize(str, parametro) {
    phoneNumber = str.replace(/[\D]/, '');

    if (phoneNumber.substring(0, 2) == "54") {
        return phoneNumber;
    }
    if (phoneNumber.substring(0, 2) == "15") {
        phoneNumber = phoneNumber.substring(3, phoneNumber.length);
    }
    if (phoneNumber.length == 8) {
        return "5411" + phoneNumber;
    }
    if (phoneNumber.substring(0) == "0") {
        return "54" + phoneNumber.substring(2, phoneNumber.length);
    }
    return "54" + phoneNumber;
}

//formata email
function emailFormat(str, validacion) {
    var regex = new RegExp(validacion.params[0]);
    if (!regex.test(str)) {
        return buildError(validacion.message, str);
    } else {
        return str;
    }
}

//formatea la ip en los casos de formato no aceptado por el agrgador
function ipFormat(value, validacion) {
    var regex = new RegExp(validacion.params[0]);
    if (value != undefined && regex.test(value)) {
        return value;
    } else {
        buildError(validacion.message, value);
    }
}

function notEmpty(validacion, value) {
    if (validacion.default == undefined && (value == null || value.trim() == '')) {
        buildError(validacion.message, value);
    } else if (value != null || value.trim() != '') {
        return value;
    } else {
        return setDefaultValue(validacion.default);
    }
}

function setDefaultValue(defaultValue) {
    if (defaultValue == 'random') { // NÚMERO ALEATORIO
        return num_random().toString();
    } else if (defaultValue == 'findState') {
        return findState('C'); // el state por defecto es capital federal
    } else {
        return defaultValue;
    }
}

function num_random() {
    var idrandom = 0;
    idrandom = parseInt(Math.random() * 800 + 1);
    return idrandom;
}

function findState(strState) {
    var s = 'C';
    if (strState && (strState.trim() != '')) {
        s = strState;
    }

    s = s.toUpperCase();
    //console.log('Estado procesado: '+ s);
    return postalcodes_hash[s];
}

function clean(data) { // VER QUE NO AFECTE EL MAIL
    var result = data.replace(/[^A-Za-z0-9@.\s]+/g, '');
    return result;
}

function truncate(data, max) {
    return data.substring(0, max);
}

function hardcode(data, hardcode) {

    if (!data) {
        return hardcode;
    }
    return data;
}

function upper(data) {
    return data.toUpperCase();
}

function execValidateFunction(value, validacion) {
    //console.log(validacion);
    switch (validacion.function) {
        case 'notEmpty':
            return notEmpty(validacion, value);
            break;

        case 'ip':
            return ipFormat(value, validacion);
            break;

        case 'email':
            return emailFormat(value, validacion);
            break;

        case 'word':
            return word(value, validacion.message);
            break;

        case 'boolean':
            return booleanFormat(value, validacion);
            break;

        case 'totalAmount':
            return totalAmount(value, validacion);
            break;

        default:
            console.log('No existe la funcion: ' + validacion.function+" campo: " + value);
            break;
    }
}

function execFormatFunction(data, format) {
    switch (format.function) {
        case 'clean':
            return clean(data);
            break;

        case 'truncate':
            return truncate(data, format.params);
            break;

        case 'hardcode':
            return hardcode(data, format.params);
            break;

        case 'upper':
            return upper(data);
            break;

        case 'csitFormat':
            return csitFormat(data, format);
            break;

        case 'phoneSanitize':
            return phoneSanitize(data, format);
            break;

        default:
            console.log('No existe la funcion: ' + format.function+" campo: " + data);
            break;
    }
}

function buildError(msj, value) {
    var error = '{"ResultMessage":"' + msj + '","ResultCode": 99977, "value":"' + value + '"}';
    throw new Error(error);
}

module.exports = {
    execValidateFunction: execValidateFunction,
    execFormatFunction: execFormatFunction,
    buildError: buildError
}
