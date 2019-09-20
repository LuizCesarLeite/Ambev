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

  /* Funções para criar os divs de cada response_type */
  const templatePauseMessage = (coisaPause, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>
      response_type:${coisaPause.response_type}, time:${coisaPause.time}, typing:${coisaPause.typing}
      </p>
    </div>
  </div>
`;

const templateOptionMessage = (coisa, from) => {
  var stringRet = `
    <div class="from-${from}">
      <div class="message-inner">
        <p>
        ${coisa.title}&nbsp;<br/>
    `;

  //<!-- <p>response_type:option, label:${coisaOption.label}, value.input.text:${coisaOption.value.input.text}</p> -->

  coisa.options.forEach(function(coisaOption){
    stringRet += `
      <input type='button' value='${coisaOption.value.input.text}' onClick='botaoOnClick("${coisaOption.value.input.text}")'></input>
    `;    
  });

  stringRet += `
        </p>
      </div>
    </div>
    `;

  return stringRet;
}

const templateImageMessage = (coisaImage, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>
      <!-- 
      response_type:${coisaImage.response_type} 
      , title: 
      -->
      ${coisaImage.title}
      <img src="${coisaImage.source}">
      </p>
    </div>
  </div>
`;

function botaoOnClick(texto){
  //textInput.value = texto + '\n';
  const template = templateChatMessage(texto, 'user');
  InsertTemplateInTheChat(template);
  getWatsonMessageAndInsertTemplate(texto);
}

/* Função para aplicar o template de cada mensagem no chat de acordo com o emissor */
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;

  /* inclui a div criada na função acima no flow do chat */
  chat.appendChild(div);

  /* auto scroll? */
  chat.scrollTop = chat.scrollHeight;
};

/* O que faz getWatsonMessageAndInsertTemplate? */
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'http://localhost:3000/assistant/';

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
    /* desligado 201811050106
    if (response.output.text) {
      var listaFrases = response.output.text;
      if (listaFrases) {
        listaFrases.forEach(function(frase){
          const template = templateChatMessage(frase,'watson');
          InsertTemplateInTheChat(template);
        })
      }
    }
    */

    if (response.output.generic) {
      var listaCoisasGenericas = response.output.generic;

      if (listaCoisasGenericas) {
        listaCoisasGenericas.forEach(function(coisa){

          if(coisa.response_type=='text'){
            const template = templateChatMessage(coisa.text,'watson');
            InsertTemplateInTheChat(template);

          } else if(coisa.response_type=='pause'){
            const template = templatePauseMessage(coisa,'watson');
            InsertTemplateInTheChat(template);

          } else if(coisa.response_type=='option'){
            const template = templateOptionMessage(coisa, 'watson');
            InsertTemplateInTheChat(template);

          } else if(coisa.response_type=='image'){
            const template = templateImageMessage(coisa,'watson');
            InsertTemplateInTheChat(template);
          }
        })
      }
    }

  }  else {
    /** Edu, me explica o que esta aqui embaixo */
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

