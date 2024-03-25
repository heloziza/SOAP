var soap = require('soap');
var url = 'http://www.dneonline.com/calculator.asmx?WSDL';

soap.createClient(url, function(err, client) {
    if(err) return console.log(err);
    var a = 30;
    var b = 2;

    client.Multiply({intA: a, intB: b}, function(err, result) {
        if(err) return console.log(err);
        console.log('Resultado: ', a, 'x', b, '=', result.MultiplyResult);
    });
});