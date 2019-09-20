const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

const port = 3000;

const assistant = new AssistantV1({
  username: '56148049-66e2-4029-b697-5e035cacd7a8',
  password: 'L4jJjDqvF5gm',
  url: 'https://gateway.watsonplatform.net/assistant/api',
  version: '2018-07-10',
});

/* Fundação: definindo o funcionamento geral */
app.post('/assistant/', (req, res) => {
  const { text, context = {} } = req.body;
  
  /* Parametro do funcionamento geral */
  const params = {
    input: { text },
    workspace_id:'9a7e4d95-b545-466a-9e2a-1b046ee42dde', /* '7cc28ec3-5faf-42b1-a620-f2a41eb93513' ID do Hans*/
    context
  };

  /* Fundação: definindo a mensagem */
  assistant.message(params, (err, response) => {
    if (err) {
      res.status(500).json(err);
    } 
    else {
      /* captura o log do Waston */
      console.log("app.post(/assistant/); response:[" + JSON.stringify(response, null, 2) + "]");
      
      res.json(response);
    }
  });
});

app.listen(port, () => console.log(`Rodando redondamente na porta ${port}`));