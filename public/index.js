var socket = io();

//  Inicia variáveis
const tabuleiro = document.getElementById("container");
const tabela = document.querySelectorAll("#container span");
const seuNomeInput = document.getElementById("player1");
const nomeOponenteInput = document.getElementById("player2");
const BotaoStart = document.getElementById("start");
const casaInput = document.querySelectorAll(".pointer");
const BotaoconfirmarNome = document.getElementById("confirmarNome");
const venceu = document.getElementById("venceu");
const spanVez = document.getElementById("turnPlayer");
const novoJogo = document.getElementById("novoJogo");
const vez = document.getElementById("vez");
const aguardo = document.getElementById("aguardo");

let container = "";

let jogadores = {
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

socket.on("listaUsuarios", (lista) => {
  jogadores.jogador1.id = lista[0];
  jogadores.jogador2.id = lista[1];
});

// Informa Id do jogador atual
let meuId = {
  nome: seuNomeInput.textContent,
  id: "",
};

socket.on("seuId", (id) => {
  meuId.id = id;

  tabela.forEach(item => {
    item.classList.add(`${meuId.id}`)
  });
});

// Recebe informação do jogador contra
let nomeOponente = "";
socket.on("player", (play) => {
  nomeOponenteInput.value = play;
  nomeOponente = play;
});

// Clique Confirmar o nome
let seuNome = "";
BotaoconfirmarNome.addEventListener("click", () => {
  socket.emit("player", seuNomeInput.value);
  seuNome = seuNomeInput.value;
  BotaoconfirmarNome.style.display = "none";
});

let autorizacao = "";
socket.on("jogador", (inf) => {
  autorizacao = inf;

  if (autorizacao == "autorizado") {
    tabuleiro.style.display = "grid";
    autorizacao = "";
  }
});



function defineNomeParaCadaId() {
  if (jogadores.jogador1.id === meuId.id) {
    jogadores.jogador1.nome = seuNomeInput.value;
    jogadores.jogador2.nome = nomeOponente;

    socket.emit("jogador", "autorizado");
  } else if (jogadores.jogador2.id === meuId.id) {
    jogadores.jogador2.nome = seuNomeInput.value;
    jogadores.jogador1.nome = nomeOponente;

    socket.emit("jogador", "autorizado");
  }
}

let jogadaDaVez = {
  posicao: "",
  letra: jogadores.jogador1.letra,
  jogador: jogadores.jogador1.nome,
};

// Clique no botão Iniciar jogo
let inicio = false;


BotaoStart.addEventListener("click", () => {
  inicio = true;
  socket.emit("iniciou", inicio);
  defineNomeParaCadaId();
  iniciaJogo();
  console.log(jogadaDaVez)

  socket.emit("jogadores", jogadores);
  spanVez.textContent = jogadores.jogador1.nome;
});

// Recebe situação atual do tabuleiro
socket.on("jogada", (jg, tab) => {
  jogadaDaVez = jg;
  container = tab;

  container.forEach((linha, indexLinha) => {
    linha.forEach((valor, indexColuna) => {
      const index = indexLinha * 3 + indexColuna;
      tabela[index].textContent = valor;
    });
  });

  if (jogadaDaVez.jogador == jogadores.jogador1.nome) {
    spanVez.textContent = jogadores.jogador2.nome;


  } else {
    spanVez.textContent = jogadores.jogador1.nome;
  }

  
});

function clique(ev) {
  // Obtém os índices da região clicada
  const span = ev.currentTarget;
  const regiao = span.dataset.region;
  jogadaDaVez.posicao = regiao;
  desabilitaRegiao(span);
  socket.emit("jogada", jogadaDaVez, jogadaDaVez.posicao);
}

function iniciaJogo() {
  // Limpa o tabuleiro (se necessário) e adiciona eventos de clique
  tabela.forEach((element) => {
    element.innerText = "";
    element.classList.add("cursor-pointer");
    element.addEventListener("click", clique);
  });
  BotaoStart.style.display = "none";
}

function desabilitaRegiao(element) {
  element.classList.remove("cursor-pointer");
  element.removeEventListener("click", clique);
}

function ganhador(element) {
  if (jogadores.jogador1.letra == element) {
    venceu.textContent = jogadores.jogador1.nome + " venceu a partida";
    desabilitarTabela();
    novoJogo.style.display = "flex";
  } else if (jogadores.jogador2.letra == element) {
    venceu.textContent = jogadores.jogador2.nome + " venceu a partida";
    desabilitarTabela();

    novoJogo.style.display = "flex";
  }
}

function desabilitarTabela() {
  tabela.forEach((item) => {
    item.classList.add("disable");
  });
}

function limpa() {
  tabela.forEach((item) => {
    item.textContent = "";
    item.classList.remove("disable");
  });
  spanVez.textContent = "";
  venceu.textContent = "";
  seuNomeInput.value = "";
  inicio = "";
  nomeOponenteInput.value = "";
  novoJogo.style.display = "none";
  BotaoconfirmarNome.style.display = "flex";
  tabuleiro.style.display = "none";
  BotaoStart.style.display = "flex";
}

novoJogo.addEventListener("click", () => {
  limpa();
});


