const { info } = require('console')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Middleware para servir arquivos estáticos
app.use(express.static('public'))

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})


let container = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let jogadores = ''
let usuariosConectados = []
let usuariosAutorizados = []

// Evento de conexão de um cliente
io.on('connection', (socket) => {
  console.log('Um cliente se conectou')

  // Gera ID único para cada usuário
  function generateUserId() {
    return Math.random().toString(36).substr(2, 9);
  }
  const userId = generateUserId();
  socket.emit('seuId', userId);

  // Captura e armazena usuarios conectados
  console.log('Usuário conectado =>', userId)
  usuariosConectados.push(userId)
  console.log(usuariosConectados)

  // Envia para todos os clientes a lista de usuários conectados
  io.emit('listaUsuarios',usuariosConectados)

  function verificarCampeao(element) {
    let vencedor = ''
    if (
      element[0][0] != '' &&
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
    return vencedor
  }

  // socket.on('iniciouJogo', (iniciouJogo) => {
  //   if(iniciouJogo == true) {
  //     container = [
  //       ["", "", ""],
  //       ["", "", ""],
  //       ["", "", ""],
  //     ];
  //     usuariosAutorizados = []
  //   }
  // })

  // Recebe jogadores
  socket.on('jogadores', (date) => {
    jogadores = date
  })

  socket.on('jogador',(info) => {
    usuariosAutorizados.push(info)
    console.log('usuarios autorizados')
    console.log(usuariosAutorizados)
    if (usuariosAutorizados[0] === usuariosAutorizados[1]) {
      io.emit('jogador', 'autorizado')
      usuariosAutorizados = []
      container = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ];
    }
  })

  // Captura cada jogada
  socket.on("jogada", (jg) => {
    if(jg.jogador === jogadores.jogador1.nome) {
      jg.jogador = jogadores.jogador2.nome
      jg.letra = jogadores.jogador2.letra
    }
    else {
      jg.jogador = jogadores.jogador1.nome
      jg.letra = jogadores.jogador1.letra
    }

    const separadorColuna = jg.posicao.split(".");
    const linha = separadorColuna[0];
    const coluna = separadorColuna[1];

    container[linha][coluna] = jg.letra

    verificarCampeao(container)
    let vencedor = verificarCampeao(container)

    console.table(container)
    io.emit("jogada", jg, container, vencedor);
  });

  // Captura e envia nome do jogador
  socket.on("player", (play) => {
    socket.broadcast.emit("player", play);
  });

  // Evento de desconexão de um cliente
  socket.on('disconnect', () => {
    console.log('Um cliente se desconectou')

    // Remove do array o ID do usuário desconectado
    usuariosConectados = usuariosConectados.filter(usuario => usuario !== userId);

    // Lista atualizada de usuários conectados
    console.log('Lista Atualizada - Usuarios conectados => ', usuariosConectados);
  })
})

// Iniciando o servidor

const PORT = process.env.PORT || 3001
http.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`)
})