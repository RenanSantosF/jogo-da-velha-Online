let index = 1




export default function limpaReiniciarJogo(
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
) {
  spanTabuleiro.forEach((item) => {
    item.textContent = "";
    item.classList.remove("disable");
  });
  spanMsgVencedor.textContent = "";
  BotaoNovoJogo.style.display = "none";
  botaoConfirmaNome.style.display = "none";
  containerTabuleiro.style.display = "none";
  BotaoStart.style.display = "flex";
  reabilitaTabela(spanTabuleiro);
  btnCriarSala.style.display = "flex";
}

function reabilitaTabela(spanTabuleiro) {
  spanTabuleiro.forEach((item) => {
    item.classList.remove("fim");
  });
}