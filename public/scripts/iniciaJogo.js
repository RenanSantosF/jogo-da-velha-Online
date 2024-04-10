export default function iniciaJogo(spanTabuleiro, clique, BotaoStart, ContainerMsgVencedor, socket, meuId, listaJogadores, spanJogadorVez, alerta, botaoConfirmaNome, inputSeuNome) {
  spanTabuleiro.forEach((element) => {
    element.innerText = "";
    element.classList.remove("disable");
    element.addEventListener("click", clique);
  });
  BotaoStart.style.display = "none";
  ContainerMsgVencedor.style.display = "flex";


  socket.emit("jogador", "autorizado", meuId.id);
  socket.emit("jogadores", listaJogadores, meuId.id);
  spanJogadorVez.textContent = listaJogadores.jogador1.nome;
  alerta.textContent = ``;
  socket.emit("player", inputSeuNome.value, meuId.id);
  botaoConfirmaNome.style.display = "none";
}