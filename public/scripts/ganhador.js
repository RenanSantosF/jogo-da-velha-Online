export default function ganhador(ContainerMsgVencedor, element, listaJogadores, spanMsgVencedor, BotaoNovoJogo, spanTabuleiro ) {
  if (listaJogadores.jogador1.letra == element) {
    spanMsgVencedor.textContent = `${listaJogadores.jogador1.nome} venceu a partida`;
    BotaoNovoJogo.style.display = "flex";
    desabilitaTabela(spanTabuleiro);
    element = "";
    ContainerMsgVencedor.style.display = "none";
  } else if (listaJogadores.jogador2.letra == element) {
    spanMsgVencedor.textContent = `${listaJogadores.jogador2.nome} venceu a partida`;
    BotaoNovoJogo.style.display = "flex";
    desabilitaTabela(spanTabuleiro);
    element = "";
    ContainerMsgVencedor.style.display = "none";
  } else if (element === "V") {
    spanMsgVencedor.textContent = `Deu velha`;
    BotaoNovoJogo.style.display = "flex";
    desabilitaTabela(spanTabuleiro);
    element = "";
    ContainerMsgVencedor.style.display = "none";
  }
}

function desabilitaTabela(spanTabuleiro) {
  spanTabuleiro.forEach((item) => {
    item.classList.add("fim");
  });
}