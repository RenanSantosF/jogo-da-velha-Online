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

let jogadores = ''
let usuariosConectados = []

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


  // Recebe jogadores
  socket.on('jogadores', (date) => {
    console.log("jogadores do servidor")
    jogadores = date
    console.log(date)
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
    console.log(jg)
    io.emit("jogada", jg);
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