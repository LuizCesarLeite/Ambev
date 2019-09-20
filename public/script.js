const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');

/* Variavel que salva o contexto da conversa */
let context = {};

/* Função para cria o div e determina o emissor da mensagem durante o chat */
const templateChatMessage = (message, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${message}</p>
    </div>
  </div>
  `;

/* Função para aplicar o template de cada mensagem do chat de acordo com o emissor */
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  /* inclui a div criada na função acima no flow do chat */
  chat.appendChild(div);
};

/* O que faz getWatsonMessageAndInsertTemplate? */
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
    /** Repete as requisições para que apareçam em balões de dialogo diferentes */
    if (response.output.text) {
      var listaFrases = response.output.text;
      if (listaFrases) {
        listaFrases.forEach(function(frase){
          const template = templateChatMessage(frase,'watson');
          InsertTemplateInTheChat(template);
        })
      }
    }

    /** Caraio, preciso saber como processar imagens, pausas e botões */
    /** A solução vai aqui nesse ponto? */
    /** Edu, me explica o que esta aqui embaixo */
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

