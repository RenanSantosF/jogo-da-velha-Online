var socket = io();

//  Inicia variáveis

const btnCriarSala = document.getElementById("btnCriarSala");
const btnEntrarSala = document.getElementById("btnEntrarSala");
const inputEntrarSala = document.getElementById("inputEntrarSala");
const inputSeuNome = document.getElementById("player1");
const botaoConfirmaNome = document.getElementById("confirmarNome");
const inputNomeOponente = document.getElementById("player2");
const BotaoStart = document.getElementById("start");
const containerTabuleiro = document.getElementById("container");
const spanTabuleiro = document.querySelectorAll("#container span");
const spanMsgVencedor = document.getElementById("venceu");
const spanJogadorVez = document.getElementById("turnPlayer");
const BotaoNovoJogo = document.getElementById("novoJogo");
const ContainerMsgVencedor = document.getElementById("vez");
const alerta = document.getElementById("alerta");
const salacheia = document.getElementById("salacheia");
let autorizacao = [];
let statusContainerTabuleiro = "";

let listaJogadores = {
  jogador1: {
    nome: "",
    id: "",
    letra: "X",
  },
  jogador2: {
    nome: "",
    id: "",
    letra: "O",
  },
};

btnCriarSala.addEventListener("click", criarSala);
btnEntrarSala.addEventListener("click", entrarSala);

let usuariosConectados = [];
socket.on("listaUsuarios", (lista) => {
  listaJogadores.jogador1.id = lista[0];
  listaJogadores.jogador2.id = lista[1];
  usuariosConectados = lista;
  if (usuariosConectados.length >= 2) {
    alerta.textContent = ``;
    validaNome();
    inputNomeOponente.placeholder = `Esperando inserir o nome`;
  } else {
    inputNomeOponente.placeholder = `Aguardando oponente...`;
  }
});

// Informa Id do jogador atual
let meuId = {
  nome: inputSeuNome.textContent,
  id: "",
};

socket.on("seuId", (id) => {
  meuId.id = id;
});

function criarSala() {
  let sala = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  socket.emit("sala", sala);
  socket.emit(`criarSala`, sala, meuId.id);
  btnCriarSala.textContent = `CONECTADO - SALA ${sala}`;
  btnEntrarSala.style.display = "none";
  inputEntrarSala.style.display = "none";
  inputSeuNome.style.display = 'flex'
  inputNomeOponente.style.display = 'flex'
  BotaoStart.style.display = 'flex'
}

function entrarSala() {
  if (inputEntrarSala.value > 2) {
    socket.emit("entrarSala", Number(inputEntrarSala.value), meuId.id);
  }

  socket.on("salaCheia", (valor, sala) => {
    if (valor === true) {
      salacheia.textContent = `A sala ${sala} está cheia. Insira outra sala ou criar uma.`;
      inputEntrarSala.value = "";
      setTimeout(() => {
        salacheia.textContent = ``;
      }, 6 * 1000);
    } else if (valor === false) {
      inputEntrarSala.style.display = "none";
      btnEntrarSala.style.display = "none";
      btnCriarSala.textContent = `CONECTADO - SALA ${sala}`;
      inputSeuNome.style.display = 'flex'
      inputNomeOponente.style.display = 'flex'
      BotaoStart.style.display = 'flex'
    } else if (valor == "inexistente") {
      salacheia.textContent = `A sala ${sala} não existe. Insira outra sala ou criar uma.`;
      inputEntrarSala.value = "";
      setTimeout(() => {
        salacheia.textContent = ``;
      }, 6 * 1000);
    }
  });
}

// Recebe informação do jogador contra
let nomeOponente = "";
socket.on("player", (play) => {
  inputNomeOponente.value = play;
  nomeOponente = play;
});

// Clique Confirmar o nome
let seuNome = "";
botaoConfirmaNome.addEventListener("click", () => {
  if (usuariosConectados.length < 2) {
    validaNome();
  } else {
    socket.emit("player", inputSeuNome.value, meuId.id);
    seuNome = inputSeuNome.value;
    botaoConfirmaNome.style.display = "none";
    inputSeuNome.setAttribute("disabled", "disable");
  }
});

socket.on("jogador", (inf) => {
  autorizacao = inf;
  console.log(autorizacao);

  if (autorizacao.length == 2) {
    containerTabuleiro.style.display = "grid";
    autorizacao = [];
  }
});

function defineNomeParaCadaId() {
  if (listaJogadores.jogador1.id === meuId.id) {
    listaJogadores.jogador1.nome = inputSeuNome.value;
    listaJogadores.jogador2.nome = nomeOponente;
  } else if (listaJogadores.jogador2.id === meuId.id) {
    listaJogadores.jogador2.nome = inputSeuNome.value;
    listaJogadores.jogador1.nome = nomeOponente;
  }
}

inputSeuNome.addEventListener("keyup", validaNome);

let jogadaDaVez = {
  posicao: "",
  letra: listaJogadores.jogador1.letra,
  jogador: listaJogadores.jogador1.nome,
};

// Clique no botão Iniciar jogo
BotaoStart.addEventListener("click", () => {
  if (nomeOponente.length < 2) {
    alerta.textContent = `Por favor, aguarde o oponente inserir um nome!`;
  } else if (inputSeuNome.value.length < 2) {
    alerta.textContent = `Por favor, insira um nome com mais de 2 caracteres!`;
  } else {
    bloqueiaRodada();
    defineNomeParaCadaId();
    iniciaJogo();
    socket.emit("jogador", "autorizado", meuId.id);
    socket.emit("jogadores", listaJogadores, meuId.id);
    spanJogadorVez.textContent = listaJogadores.jogador1.nome;
    alerta.textContent = ``;
    socket.emit("player", inputSeuNome.value, meuId.id);
    botaoConfirmaNome.style.display = "none";
  }
});

// Recebe situação atual do tabuleiro
let vencedorPartida = "";
socket.on("jogada", (jg, tab, vencedor, salaPorusuario) => {
  vencedorPartida = vencedor;
  jogadaDaVez = jg;
  statusContainerTabuleiro = tab;
  ganhador(vencedorPartida);

  statusContainerTabuleiro.forEach((linha, indexLinha) => {
    linha.forEach((valor, indexColuna) => {
      const index = indexLinha * 3 + indexColuna;
      spanTabuleiro[index].textContent = valor;
      if (spanTabuleiro[index].textContent == "X") {
        spanTabuleiro[index].style.color = "#66a385"
      } else {
        spanTabuleiro[index].style.color = "#c46627"
      }

      if (spanTabuleiro[index].textContent == "X") {
        spanTabuleiro[index].style.color = "#66a385";
      } else {
        spanTabuleiro[index].style.color = "#c46627";
      }

      if (spanTabuleiro[index].textContent !== "") {
        spanTabuleiro[index].classList.add("fim");

        if (jogadaDaVez.jogador == listaJogadores.jogador1.nome) {
          spanJogadorVez.textContent = listaJogadores.jogador2.nome;
        } else if (jogadaDaVez.jogador == listaJogadores.jogador2.nome) {
          spanJogadorVez.textContent = listaJogadores.jogador1.nome;
        }
      }
    });
  });
});

BotaoNovoJogo.addEventListener("click", () => {
  limpaReiniciarJogo();
});

function clique(ev) {
  // Obtém os índices da região clicada
  const span = ev.currentTarget;
  const regiao = span.dataset.region;
  jogadaDaVez.posicao = regiao;
  // desabilitaRegiao(span);
  document.addEventListener("click", bloqueiaRodada());

  socket.emit("jogada", jogadaDaVez, meuId.id);
}

function iniciaJogo() {
  spanTabuleiro.forEach((element) => {
    element.innerText = "";
    element.classList.remove("disable");
    element.addEventListener("click", clique);
  });
  BotaoStart.style.display = "none";
  ContainerMsgVencedor.style.display = "flex";
}

function ganhador(element) {
  if (listaJogadores.jogador1.letra == element) {
    spanMsgVencedor.textContent = `${listaJogadores.jogador1.nome} venceu a partida`;
    BotaoNovoJogo.style.display = "flex";
    desabilitaTabela();
    element = "";
    ContainerMsgVencedor.style.display = "none";
  } else if (listaJogadores.jogador2.letra == element) {
    spanMsgVencedor.textContent = `${listaJogadores.jogador2.nome} venceu a partida`;
    BotaoNovoJogo.style.display = "flex";
    desabilitaTabela();
    element = "";
    ContainerMsgVencedor.style.display = "none";
  } else if (element === "V") {
    spanMsgVencedor.textContent = `Deu velha`;
    BotaoNovoJogo.style.display = "flex";
    desabilitaTabela();
    element = "";
    ContainerMsgVencedor.style.display = "none";
  }

  else if (element == "V") {
    spanMsgVencedor.textContent = `Deu Velha`;
    BotaoNovoJogo.style.display = "flex";
    desabilitaTabela();
    element = "";
    ContainerMsgVencedor.style.display = "none";
  }
}

export function limpaReiniciarJogo() {
  spanTabuleiro.forEach((item) => {
    item.textContent = "";
    item.classList.remove("disable");
  });
  nomeOponente = "";
  spanJogadorVez.textContent = "";
  spanMsgVencedor.textContent = "";
  inputSeuNome.value = "";
  inputNomeOponente.value = "";
  BotaoNovoJogo.style.display = "none";
  botaoConfirmaNome.style.display = "none";
  containerTabuleiro.style.display = "none";
  BotaoStart.style.display = "flex";
  reabilitaTabela();
  jogadaDaVez.jogador = listaJogadores.jogador2.nome;
  jogadaDaVez.jogador = listaJogadores.jogador2.nome;
  inputSeuNome.removeAttribute("disabled");
  btnCriarSala.style.display = "flex";
}

function waitForElement(selector) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId);
        resolve(element);
      }
    }, 100);
  });
}

async function bloqueiaRodada() {
  const spanJogadorVez = await waitForElement("#turnPlayer");

  setInterval(() => {
    if (spanJogadorVez.textContent !== inputSeuNome.value) {
      spanTabuleiro.forEach((item) => {
        item.classList.add("disable");
      });
    } else {
      spanTabuleiro.forEach((item) => {
        item.classList.remove("disable");
      });
    }
  }, 10);
}

function desabilitaTabela() {
  spanTabuleiro.forEach((item) => {
    item.classList.add("fim");
  });
}

function reabilitaTabela() {
  spanTabuleiro.forEach((item) => {
    item.classList.remove("fim");
  });
}

function validaNome() {
  if (inputSeuNome.value.length < 2) {
    botaoConfirmaNome.style.display = "none";
  } else if (usuariosConectados.length < 2) {
    botaoConfirmaNome.style.display = "none";
    alerta.textContent = `Aguarde até que o seu oponente se conecte!`;
  } else {
    botaoConfirmaNome.style.display = "flex";
    alerta.textContent = ``;
  }
}

socket.on("teste", (autorizad, porSala) => {
  console.log(autorizad);
  console.log(porSala);
});
