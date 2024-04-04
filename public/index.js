var socket = io();

//  Inicia variáveis
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
const spanMsgAguardarJogador = document.getElementById("aguardo");
let iniciouJogo = false;
let autorizacao = "";

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

socket.on("listaUsuarios", (lista) => {
  listaJogadores.jogador1.id = lista[0];
  listaJogadores.jogador2.id = lista[1];
});

// Informa Id do jogador atual
let meuId = {
  nome: inputSeuNome.textContent,
  id: "",
};

socket.on("seuId", (id) => {
  meuId.id = id;
});

// Recebe informação do jogador contra
let nomeOponente = "";
socket.on("player", (play) => {
  inputNomeOponente.value = play;
  nomeOponente = play;
});

// Clique Confirmar o nome
let seuNome = "";
botaoConfirmaNome.addEventListener("click", () => {
  socket.emit("player", inputSeuNome.value);
  seuNome = inputSeuNome.value;
  botaoConfirmaNome.style.display = "none";
});

socket.on("jogador", (inf) => {
  autorizacao = inf;

  if (autorizacao == "autorizado") {
    containerTabuleiro.style.display = "grid";
    autorizacao = "";
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

let jogadaDaVez = {
  posicao: "",
  letra: listaJogadores.jogador1.letra,
  jogador: listaJogadores.jogador1.nome,
};

// Clique no botão Iniciar jogo


BotaoStart.addEventListener("click", () => {
  
  bloqueiaRodada()
  defineNomeParaCadaId();
  iniciaJogo();
  socket.emit("jogador", "autorizado");
  socket.emit("jogadores", listaJogadores);
  spanJogadorVez.textContent = listaJogadores.jogador1.nome;
});

// Recebe situação atual do tabuleiro
socket.on("jogada", (jg, tab) => {
  jogadaDaVez = jg;
  statusContainerTabuleiro = tab;

  statusContainerTabuleiro.forEach((linha, indexLinha) => {
    linha.forEach((valor, indexColuna) => {
      const index = indexLinha * 3 + indexColuna;
      spanTabuleiro[index].textContent = valor;

      if (spanTabuleiro[index].textContent !== '') {
        spanTabuleiro[index].classList.add('disable')

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
  limpa();
});

function clique(ev) {
  // Obtém os índices da região clicada
  const span = ev.currentTarget;
  const regiao = span.dataset.region;
  jogadaDaVez.posicao = regiao;
  // desabilitaRegiao(span);
  bloqueiaRodada()
  socket.emit("jogada", jogadaDaVez, jogadaDaVez.posicao);
  console.log('jogada da vez- clique')
  console.log(jogadaDaVez)
}

function iniciaJogo() {
  spanTabuleiro.forEach((element) => {
    element.innerText = "";
    element.classList.remove("disable");
    element.addEventListener("click", clique);
  });
  BotaoStart.style.display = "none";
}

// function desabilitaRegiao(element) {
//   element.classList.add("disable");
//   element.removeEventListener("click", clique);
// }

function ganhador(element) {
  if (listaJogadores.jogador1.letra == element) {
    spanMsgVencedor.textContent = listaJogadores.jogador1.nome + " venceu a partida";
    desabilitarTabela();
    BotaoNovoJogo.style.display = "flex";
  } else if (listaJogadores.jogador2.letra == element) {
    spanMsgVencedor.textContent = listaJogadores.jogador2.nome + " venceu a partida";
    desabilitarTabela();

    BotaoNovoJogo.style.display = "flex";
  }
}

function limpa() {
  spanTabuleiro.forEach((item) => {
    item.textContent = "";
    item.classList.remove("disable");
  });
  spanJogadorVez.textContent = "";
  spanMsgVencedor.textContent = "";
  inputSeuNome.value = "";
  iniciouJogo = "";
  inputNomeOponente.value = "";
  BotaoNovoJogo.style.display = "none";
  botaoConfirmaNome.style.display = "flex";
  containerTabuleiro.style.display = "none";
  BotaoStart.style.display = "flex";
}

function waitForElement(selector) {
  return new Promise(resolve => {
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
  const spanJogadorVez = await waitForElement('#turnPlayer');

  setInterval(() => {
    if (spanJogadorVez.textContent !== inputSeuNome.value) {
      spanTabuleiro.forEach((item) => {
        item.classList.add('disable');
      });
    } else {
      spanTabuleiro.forEach((item) => {
        item.classList.remove('disable');
      });
    }
  }, 10);
}