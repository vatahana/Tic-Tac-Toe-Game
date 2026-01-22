const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { time } = require('console');

const chatController = require('./controllers/chat.controller');
const gameController = require('./controllers/game.controller')

const app = express();
app.use(cors());

const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: '*'
//   }
// });

const io = new Server(server, {
  cors: {
    origin: 'https://tictactoesv9.vercel.app',
    methods: ['GET', 'POST']
  }
});

chatController(io);
gameController(io);


server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
