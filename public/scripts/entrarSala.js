export default function entrarSala(socket, inputNomeOponente, BotaoStart,  inputEntrarSala, meuId, btnEntrarSala, salacheia, btnCriarSala, inputSeuNome) {
  if (inputEntrarSala.value > 2) {
    socket.emit("entrarSala", Number(inputEntrarSala.value), meuId.id);
  }

  socket.on("salaCheia", (valor, sala) => {
    if (valor === true) {
      salacheia.textContent = `A sala ${sala} está cheia. Insira outra sala ou criar uma.`;
      inputEntrarSala.value = "";
      setTimeout(() => {
        salacheia.textContent = ``;
      }, 6 * 1000);
    } else if (valor === false) {
      inputEntrarSala.style.display = "none";
      btnEntrarSala.style.display = "none";
      btnCriarSala.textContent = `CONECTADO - SALA ${sala}`;
      inputSeuNome.style.display = 'flex'
      inputNomeOponente.style.display = 'flex'
      BotaoStart.style.display = 'flex'
    } else if (valor == "inexistente") {
      salacheia.textContent = `A sala ${sala} não existe. Insira outra sala ou criar uma.`;
      inputEntrarSala.value = "";
      setTimeout(() => {
        salacheia.textContent = ``;
      }, 6 * 1000);
    }
  });
}