const soap = require('soap');

const url = 'http://localhost:3000/mdc';

const args = {
  x: 1080,
  y: 1920
};

soap.createClient(url, function(err, client) {
  if (err) {
    console.error('Erro ao criar cliente SOAP:', err);
  } else {
    client.CalculateMDC(args, function(err, result) {
      if (err) {
        console.error('Erro ao chamar operação CalculateMDC:', err);
      } else {
        console.log(result);
      }
    });
  }
});