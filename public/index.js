//  Inicia variáveis
var socket = io();
const SeuNomeInput = document.getElementById("player1");
const nomeOponenteInput = document.getElementById("player2");
const BotaoStart = document.getElementById("start");
const casaInput = document.querySelectorAll(".pointer");
const BotaoconfirmarNome = document.getElementById("confirmarNome");



const container = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

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
  nome: SeuNomeInput.textContent,
  id: ""
};

socket.on("seuId", (id) => {
  meuId.id = id;
  console.log("ID jogador atual => " + meuId.id);
});

// Clique Confirmar o nome
let seuNome = "";
BotaoconfirmarNome.addEventListener("click", () => {
  socket.emit("player", SeuNomeInput.value);
  seuNome = SeuNomeInput.value;
});

// Recebe informação do jogador contra
let nomeOponente = "não deu certo";
socket.on("player", (play) => {
  console.log("Jogador oponente " + play);
  nomeOponenteInput.value = play;
  nomeOponente = play;
  if (play) {
    BotaoStart.removeAttribute("disabled");
  }
});

function defineNomeParaCadaId() {
  if (jogadores.jogador1.id === meuId.id) {
    jogadores.jogador1.nome = SeuNomeInput.value;
    jogadores.jogador2.nome = nomeOponente;
  } else if (jogadores.jogador2.id === meuId.id) {
    jogadores.jogador2.nome = SeuNomeInput.value;
    jogadores.jogador1.nome = nomeOponente;
  }
}

// Clique no botão Iniciar jogo
BotaoStart.addEventListener("click", () => {
  defineNomeParaCadaId()
  socket.emit('jogadores', jogadores)
  console.log("jogadores")
  console.log(jogadores)
});

let jogadaDaVez = {
  posicao: "",
  letra: jogadores.jogador1.letra,
  jogador: jogadores.jogador1.nome,
};

// Recebe situação atual do tabuleiro
socket.on("jogada", (jg) => {
  jogadaDaVez.posicao = jg.posicao;
  jogadaDaVez.letra = jg.letra;
  jogadaDaVez.jogador = jg.jogador

  const convertePosicao = jogadaDaVez.posicao.split(".");
  container[convertePosicao[0]][convertePosicao[1]] = jogadaDaVez.letra;
  console.log("tabuleiro: ")
  console.log(container);
  console.log("jogada: ")
  console.log(convertePosicao);
});

// Verifica onde foi clicado
Array.from(casaInput).forEach((e) => {
  e.addEventListener("click", (e) => {
    const toque = e.currentTarget;
    toque.innerText = jogadaDaVez.letra
    const valorDataRegion = toque.getAttribute("data-region");
    jogadaDaVez.posicao = valorDataRegion;
    socket.emit("jogada", jogadaDaVez);
  });
});


