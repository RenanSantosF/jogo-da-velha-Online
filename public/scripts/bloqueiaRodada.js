function waitForElement(selector) {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(intervalId);
        resolve(element);
      }
    }, 100);
  });
}

export default async function bloqueiaRodada(inputSeuNome, spanTabuleiro) {
  const spanJogadorVez = await waitForElement("#turnPlayer");

  setInterval(() => {
    if (spanJogadorVez.textContent !== inputSeuNome.value) {
      spanTabuleiro.forEach((item) => {
        item.classList.add("disable");
      });
    } else {
      spanTabuleiro.forEach((item) => {
        item.classList.remove("disable");
      });
    }
  }, 10);
}