export default function ganhador(ContainerMsgVencedor, element, listaJogadores, spanMsgVencedor, BotaoNovoJogo, spanTabuleiro ) {
  if (listaJogadores.jogador1.letra == element) {
    setTimeout(() => {
      spanMsgVencedor.textContent = `${listaJogadores.jogador1.nome} venceu a partida`;
      BotaoNovoJogo.style.display = "flex";
      desabilitaTabela(spanTabuleiro);
      element = "";
      ContainerMsgVencedor.style.display = "none";
      somWin()
    }, 500);

  } else if (listaJogadores.jogador2.letra == element) {
    setTimeout (() => {
      spanMsgVencedor.textContent = `${listaJogadores.jogador2.nome} venceu a partida`;
      BotaoNovoJogo.style.display = "flex";
      desabilitaTabela(spanTabuleiro);
      element = "";
      ContainerMsgVencedor.style.display = "none";
      somWin()
    }, 500)

  } else if (element === "V") {
    setTimeout (() => {
      spanMsgVencedor.textContent = `Deu velha`;
      BotaoNovoJogo.style.display = "flex";
      desabilitaTabela(spanTabuleiro);
      element = "";
      ContainerMsgVencedor.style.display = "none";
      somWin()
    }, 500)

  }
}

function desabilitaTabela(spanTabuleiro) {
  spanTabuleiro.forEach((item) => {
    item.classList.add("fim");
  });
}

function somWin() {
  let som = document.getElementById('somWin');
  som.play();
}