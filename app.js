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
  version: '2018-02-16',
});

/* */
app.post('/conversation/', (req, res) => {
  const { text, context = {} } = req.body;
  
  const params = {
    input: { text },
    workspace_id:'7cc28ec3-5faf-42b1-a620-f2a41eb93513',
    context,
  };

  assistant.message(params, (err, response) => {
    if (err) {
      /* console.error(err); ---> dica do autor */
      res.status(500).json(err);
    } else {
    res.json(response);
    }
  });
});

app.listen(port, () => console.log(`Running on port ${port}`));