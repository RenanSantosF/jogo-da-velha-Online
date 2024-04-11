// Importa as dependências
var socket = io();
import validaNome from "./scripts/validaNome.js";
import reabilitaTabela from "./scripts/reabilitaTabela.js";
import desabilitaTabela from "./scripts/desabilitaTabela.js";
import bloqueiaRodada from "./scripts/bloqueiaRodada.js";
import limpaReiniciarJogo from "./scripts/limpaReiniciarJogo.js";
import ganhador from "./scripts/ganhador.js";
import iniciaJogo from "./scripts/iniciaJogo.js";
import defineNomeParaCadaId from "./scripts/defineNomeParaCadaId.js";
import criarSala from "./scripts/criarSala.js";
import entrarSala from "./scripts/entrarSala.js";

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
let nomeOponente = "";

let meuId = {
  nome: "",
  id: "",
};

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

btnCriarSala.addEventListener("click", () => {
  criarSala(
    socket,
    meuId,
    btnCriarSala,
    btnEntrarSala,
    inputEntrarSala,
    inputSeuNome,
    inputNomeOponente,
    BotaoStart
  );
});
btnEntrarSala.addEventListener("click", () => {
  entrarSala(
    socket,
    inputNomeOponente,
    BotaoStart,
    inputEntrarSala,
    meuId,
    btnEntrarSala,
    salacheia,
    btnCriarSala,
    inputSeuNome
  );
});

let usuariosConectados = [];
socket.on("listaUsuarios", (lista) => {
  listaJogadores.jogador1.id = lista[0];
  listaJogadores.jogador2.id = lista[1];
  usuariosConectados = lista;
  if (usuariosConectados.length >= 2) {
    alerta.textContent = ``;
    validaNome(inputSeuNome, botaoConfirmaNome, usuariosConectados, alerta);
    inputNomeOponente.placeholder = `Esperando inserir o nome`;
  } else {
    inputNomeOponente.placeholder = `Aguardando oponente...`;
  }
});

let jogadaDaVez = {
  posicao: "",
  letra: listaJogadores.jogador1.letra,
  jogador: listaJogadores.jogador1.nome,
};

// Recebe ID
socket.on("seuId", (id) => {
  meuId.id = id;
});

// Recebe informação do jogador contra
socket.on("player", (play) => {
  inputNomeOponente.value = play;
  nomeOponente = play;
});

botaoConfirmaNome.addEventListener("click", () => {
  if (usuariosConectados.length < 2) {
    validaNome(inputSeuNome, botaoConfirmaNome, usuariosConectados, alerta);
  } else {
    socket.emit("player", inputSeuNome.value, meuId.id);
    botaoConfirmaNome.style.display = "none";
    inputSeuNome.setAttribute("disabled", "disable");
  }
});

// Verifica autorização para iniciar o jogo
socket.on("jogador", (inf) => {
  autorizacao = inf;

  if (autorizacao.length == 2) {
    containerTabuleiro.style.display = "grid";
    autorizacao = [];
  }
});

inputSeuNome.addEventListener("keyup", () => {
  validaNome(inputSeuNome, botaoConfirmaNome, usuariosConectados, alerta);
});

// Clique no botão Iniciar jogo
BotaoStart.addEventListener("click", () => {
  if (nomeOponente.length < 2) {
    alerta.textContent = `Por favor, aguarde o oponente inserir um nome!`;
  } else if (inputSeuNome.value.length < 2) {
    alerta.textContent = `Por favor, insira um nome com mais de 2 caracteres!`;
  } else {
    bloqueiaRodada(inputSeuNome, spanTabuleiro);
    defineNomeParaCadaId(listaJogadores, meuId, inputSeuNome, nomeOponente);
    iniciaJogo(spanTabuleiro, clique, BotaoStart, ContainerMsgVencedor, socket, meuId, listaJogadores, spanJogadorVez, alerta, botaoConfirmaNome, inputSeuNome);
  }
});

// Recebe situação atual do tabuleiro
let vencedorPartida = "";
socket.on("jogada", (jg, tab, vencedor) => {
  vencedorPartida = vencedor;
  jogadaDaVez = jg;
  statusContainerTabuleiro = tab;
  ganhador(
    ContainerMsgVencedor,
    vencedorPartida,
    listaJogadores,
    spanMsgVencedor,
    BotaoNovoJogo,
    spanTabuleiro
  );

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
  limpaReiniciarJogo(
    listaJogadores,
    btnCriarSala,
    jogadaDaVez,
    BotaoStart,
    spanTabuleiro,
    nomeOponente,
    spanJogadorVez,
    spanMsgVencedor,
    inputSeuNome,
    inputNomeOponente,
    BotaoNovoJogo,
    botaoConfirmaNome,
    containerTabuleiro
  );
});

function clique(ev) {
  // Obtém os índices da região clicada
  const span = ev.currentTarget;
  const regiao = span.dataset.region;
  jogadaDaVez.posicao = regiao;
  // desabilitaRegiao(span);
  document.addEventListener(
    "click",
    bloqueiaRodada(inputSeuNome, spanTabuleiro)
  );

  socket.emit("jogada", jogadaDaVez, meuId.id);
}
