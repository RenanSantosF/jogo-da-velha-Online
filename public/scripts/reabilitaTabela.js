export default function reabilitaTabela(spanTabuleiro) {
  spanTabuleiro.forEach((item) => {
    item.classList.remove("fim");
  });
}