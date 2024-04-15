export default function validaNome(inputSeuNome, botaoConfirmaNome, usuariosConectados, alerta, nomeOponente) {
  if (inputSeuNome.value.length < 2) {
    botaoConfirmaNome.style.display = "none";
  } else if (usuariosConectados.length < 2) {
    botaoConfirmaNome.style.display = "none";
    alerta.textContent = `Aguarde até que o seu oponente se conecte!`;
  }
  else if (inputSeuNome.value == nomeOponente) {
    botaoConfirmaNome.style.display = "none";
    alerta.textContent = `Insira um nome diferente de seu oponente!`;
  } else {
    botaoConfirmaNome.style.display = "flex";
    alerta.textContent = ``;
  }
}
