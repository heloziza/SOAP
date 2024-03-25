const express = require('express');

function calculateMDC(x, y) {
  while(y) {
      var temp = y;
      y = x % y;
      x = temp;
  }
  return x;
}

const app = express();

app.use(express.text({ type: 'text/xml' }));
app.post('/mdc', function(req, res) {
  //console.log('XML recebido:', req.body);
  //console.log(req.body);

  const matches = req.body.match(/<x>(\d+)<\/x>\s*<y>(\d+)<\/y>/);
  if (!matches) {
    console.error('Erro: Não foi possível encontrar os valores de x e y no XML.');
    res.status(500).send('Erro: Não foi possível encontrar os valores de x e y no XML.');
    return;
  }

  const x = parseInt(matches[1]);
  const y = parseInt(matches[2]);
  const mdc = calculateMDC(x, y);

  const xAspectRatio = x/mdc;
  const yAspectRatio = y/mdc;

  const responseXML = `
    <soap:Envelope>
      <soap:Body>
        <CalculateMDCResponse>
          <result>
            Aspect Ratio = ${xAspectRatio} : ${yAspectRatio}
          </result>
        </CalculateMDCResponse>
      </soap:Body>
    </soap:Envelope>
  `;

  res.status(200).send(responseXML);
});

app.get('/mdc', (req, res) => {
  const xml = `<definitions name="MDCCalculator"
  targetNamespace="http://localhost:3000/mdc"
  xmlns="http://schemas.xmlsoap.org/wsdl/"
  xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
  xmlns:tns="http://localhost:3000/mdc"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema">

<message name="CalculateMDCRequest">
<part name="x" type="xsd:int"/>
<part name="y" type="xsd:int"/>
</message>
<message name="CalculateMDCResponse">
<part name="MDC" type="xsd:int"/>
</message>

<portType name="MDCPortType">
<operation name="CalculateMDC">
 <input message="tns:CalculateMDCRequest"/>
 <output message="tns:CalculateMDCResponse"/>
</operation>
</portType>

<binding name="MDCBinding" type="tns:MDCPortType">
<soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
<operation name="CalculateMDC">
 <soap:operation soapAction="http://localhost:3000/mdc#CalculateMDC"/>
 <input>
     <soap:body use="literal"/>
 </input>
 <output>
     <soap:body use="literal"/>
 </output>
</operation>
</binding>

<service name="MDCService">
<port name="MDCPort" binding="tns:MDCBinding">
 <soap:address location="http://localhost:3000/mdc"/>
</port>
</service>

</definitions>`;
  res.type('application/xml');
  res.send(xml);
});

const server = app.listen(3000, function() {
  console.log('Servidor iniciado na porta', server.address().port);
});