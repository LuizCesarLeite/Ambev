const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');

/* Variavel que salva o contexto da conversa */
let context = {};

/* Função para determinar o template de cada mensagem durante o chat */
const templateChatMessage = (message, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${message}</p>
    </div>
  </div>
  `;

/* Função para aplicar o template de cada mensagem do chat */
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  chat.appendChild(div);
};

/* Entendi foi nada aqui */
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'http://localhost:3000/conversation/';

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      context,
    }),
  })).json();

  context = response.context;

  if (response.output) {
    if (response.output.text) {
      const template = templateChatMessage(response.output.text, 'watson');
      InsertTemplateInTheChat(template);
    }
  }  else {
    const template = templateChatMessage(response.code + ":" + response.error, 'watson');
    InsertTemplateInTheChat(template);
  }
};

/* Se o usuario clica Enter... */
textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    getWatsonMessageAndInsertTemplate(textInput.value);

    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);
    
    textInput.value = '';
  }
});

/* Diz ai, Watson! */
getWatsonMessageAndInsertTemplate();

