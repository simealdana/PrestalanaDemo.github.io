export function formatNumbers(num) {
    var separador = "."; // separador para los miles
    var sepDecimal = ','; // separador para los decimales

    num += '';
    var splitStr = num.split('.');
    var splitLeft = splitStr[0];
    var splitRight = splitStr.length > 1 ? sepDecimal + splitStr[1] : '';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(splitLeft)) {
        splitLeft = splitLeft.replace(regx, '$1' + separador + '$2');
    }
    return  splitLeft + splitRight;
}