const { info } = require("console");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

// Middleware para servir arquivos estáticos
app.use(express.static("public"));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Variáveis globais
let container = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
let jogadores = "";
let usuariosConectados = [];
let usuariosAutorizados = [];
let minhaSala = 0;

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
  }
  return vencedor;
}

// Evento de conexão de um cliente
io.on("connection", (socket) => {
  // Escuta e cria a sala e adiciona o usuário
  socket.on("criarSala", (salaCriada) => {
    socket.join(salaCriada);
    minhaSala = salaCriada;
    console.log("sala criada" + salaCriada);

    // Captura e armazena usuarios conectados
    console.log("Usuário conectado =>", userId);
    if (usuariosConectados.length <2) {
      usuariosConectados.push(userId);
    }
  });

  
  // Escuta e direciona o cliente à sala existente
  socket.on("entrarSala", (salaEntrar) => {
    

    // Verificar o número de usuários na sala
    const usuariosNaSala = io.sockets.adapter.rooms.get(salaEntrar);

    console.log("Integrantes da sala:", usuariosNaSala);

    if (!usuariosNaSala || usuariosNaSala.size < 2) {
        socket.join(salaEntrar);
        minhaSala = salaEntrar;
        usuariosConectados.push(userId);
        socket.emit('salaCheia', false);
    } else {
        socket.emit('salaCheia', true, salaEntrar);
    }

    // Envia para todos os clientes a lista de usuários conectados
    io.to(minhaSala).emit("listaUsuarios", usuariosConectados);
  });

  // Gera ID único para cada usuário
  function generateUserId() {
    return Math.random().toString(36).substr(2, 9);
  }
  const userId = generateUserId();
  socket.emit("seuId", userId);

  // Recebe jogadores do frontend e armazena na variável
  socket.on("jogadores", (date) => {
    jogadores = date;
  });

  // Verifica se está autorizado a começar
  socket.on("jogador", (info) => {
    usuariosAutorizados.push(info);
    console.log("usuarios autorizados");
    console.log(usuariosAutorizados);
    if (usuariosAutorizados[0] === usuariosAutorizados[1]) {
      io.to(minhaSala).emit("jogador", "autorizado");
      usuariosAutorizados = [];
      container = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
  });

  // Captura cada jogada e alterna jogador
  socket.on("jogada", (jg) => {
    if (jg.jogador === jogadores.jogador1.nome) {
      jg.jogador = jogadores.jogador2.nome;
      jg.letra = jogadores.jogador2.letra;
    } else {
      jg.jogador = jogadores.jogador1.nome;
      jg.letra = jogadores.jogador1.letra;
    }

    const separadorColuna = jg.posicao.split(".");
    const linha = separadorColuna[0];
    const coluna = separadorColuna[1];

    container[linha][coluna] = jg.letra;

    verificarCampeao(container);
    let vencedor = verificarCampeao(container);

    io.to(minhaSala).emit("jogada", jg, container, vencedor);
  });

  // Captura e envia nome do jogador
  socket.on("player", (play) => {
    console.log("minha sala " + minhaSala);

    socket.to(minhaSala).emit("player", play);
  });

  // Evento de desconexão de um cliente
  socket.on("disconnect", () => {
    console.log("Um cliente se desconectou");

    // Remove do array o ID do usuário desconectado
    usuariosConectados = usuariosConectados.filter(
      (usuario) => usuario !== userId
    );

    // Lista atualizada de usuários conectados
    console.log(
      "Lista Atualizada - Usuarios conectados => ",
      usuariosConectados
    );

    // Envia para todos os clientes a lista de usuários conectados
    io.to(minhaSala).emit("listaUsuarios", usuariosConectados);
  });
});

// Iniciando o servidor

const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
