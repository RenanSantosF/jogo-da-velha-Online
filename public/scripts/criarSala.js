export default function criarSala(socket, meuId, btnCriarSala, btnEntrarSala, inputEntrarSala, inputSeuNome, inputNomeOponente, BotaoStart) {
  let sala = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  socket.emit("sala", sala);
  socket.emit(`criarSala`, sala, meuId.id);
  btnCriarSala.textContent = `CONECTADO - SALA ${sala}`;
  document.getElementById("btnCriarSala").disabled = true;
  btnCriarSala.style.backgroundColor = '#777777'
  inputEntrarSala.style.display = "none";
  btnEntrarSala.style.display = "none";
  inputSeuNome.style.display = 'flex'
  inputNomeOponente.style.display = 'flex'
  BotaoStart.style.display = 'flex'
}