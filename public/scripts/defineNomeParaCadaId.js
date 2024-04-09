export default function defineNomeParaCadaId(listaJogadores, meuId, inputSeuNome, nomeOponente,  ) {
  if (listaJogadores.jogador1.id === meuId.id) {
    listaJogadores.jogador1.nome = inputSeuNome.value;
    listaJogadores.jogador2.nome = nomeOponente;
  } else if (listaJogadores.jogador2.id === meuId.id) {
    listaJogadores.jogador2.nome = inputSeuNome.value;
    listaJogadores.jogador1.nome = nomeOponente;
  }
}