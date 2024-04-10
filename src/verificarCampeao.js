function verificarCampeao(element) {
  let vencedor = "";
  if (
    element[0][0] != "" &&
    element[0][0] == element[0][1] &&
    element[0][1] == element[0][2]
  ) {
    vencedor = element[0][0];
  } else if (
    element[1][0] &&
    element[1][0] == element[1][1] &&
    element[1][1] == element[1][2]
  ) {
    vencedor = element[1][0];
  } else if (
    element[2][0] &&
    element[2][0] == element[2][1] &&
    element[2][1] == element[2][2]
  ) {
    vencedor = element[2][0];
  } else if (
    element[0][0] &&
    element[0][0] == element[1][0] &&
    element[1][0] == element[2][0]
  ) {
    vencedor = element[0][0];
  } else if (
    element[0][1] &&
    element[0][1] == element[1][1] &&
    element[1][1] == element[2][1]
  ) {
    vencedor = element[0][1];
  } else if (
    element[0][2] &&
    element[0][2] == element[1][2] &&
    element[1][2] == element[2][2]
  ) {
    vencedor = element[0][2];
  } else if (
    element[0][0] &&
    element[0][0] == element[1][1] &&
    element[1][1] == element[2][2]
  ) {
    vencedor = element[0][0];
  } else if (
    element[0][2] &&
    element[0][2] == element[1][1] &&
    element[1][1] == element[2][0]
  ) {
    vencedor = element[0][2];
  } else {
    if (
      element[0][0] !== "" &&
      element[0][1] !== "" &&
      element[0][2] !== "" &&
      element[1][0] !== "" &&
      element[1][1] !== "" &&
      element[1][2] !== "" &&
      element[2][0] !== "" &&
      element[2][1] !== "" &&
      element[2][2] !== ""
    ) {
      vencedor = "V";
    }
  }
  return vencedor;
}

module.exports = verificarCampeao