export default function iniciaJogo(spanTabuleiro, clique, BotaoStart, ContainerMsgVencedor) {
  spanTabuleiro.forEach((element) => {
    element.innerText = "";
    element.classList.remove("disable");
    element.addEventListener("click", clique);
  });
  BotaoStart.style.display = "none";
  ContainerMsgVencedor.style.display = "flex";
}