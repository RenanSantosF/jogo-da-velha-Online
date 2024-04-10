export default function desabilitaTabela(spanTabuleiro) {
    spanTabuleiro.forEach((item) => {
      item.classList.add("fim");
    });
  }