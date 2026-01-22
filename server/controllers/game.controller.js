module.exports = function (io) {

  const rooms = {};
  let waitingPlayer = null;
  let roomCount = 1;

  function checkWinner(board) {
    const win = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (const [a,b,c] of win) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.every(c => c) ? 'draw' : null;
  }

  io.on('connection', socket => {

    socket.on('find-match', () => {

      if (waitingPlayer) {
        const roomId = `room-${roomCount++}`;

        rooms[roomId] = {
          board: Array(9).fill(null),
          turn: 'X',
          winner: null,
          rematchVotes: 0
        };

        socket.join(roomId);
        waitingPlayer.join(roomId);

        socket.roomId = roomId;
        waitingPlayer.roomId = roomId;

        waitingPlayer.role = 'X';
        socket.role = 'O';

        waitingPlayer.emit('role', 'X');
        socket.emit('role', 'O');

        io.to(roomId).emit('state', rooms[roomId]);

        waitingPlayer = null;
      } else {
        waitingPlayer = socket;
        socket.emit('waiting');
      }
    });

    socket.on('move', index => {
      const room = rooms[socket.roomId];
      if (!room || room.winner) return;
      if (room.turn !== socket.role) return;
      if (room.board[index]) return;

      room.board[index] = socket.role;
      room.winner = checkWinner(room.board);
      room.turn = room.turn === 'X' ? 'O' : 'X';

      io.to(socket.roomId).emit('state', room);
    });

    // control when use rematch game
    socket.on('rematch', () => {
      const room = rooms[socket.roomId];
      if (!room) return;

      room.rematchVotes++;

      if (room.rematchVotes === 2) {
        room.board = Array(9).fill(null);
        room.turn = 'X';
        room.winner = null;
        room.rematchVotes = 0;

        io.to(socket.roomId).emit('state', room);
      }
    });

    socket.on('disconnect', () => {
      if (waitingPlayer?.id === socket.id) {
        waitingPlayer = null;
      }

      const roomId = socket.roomId;
      if (!roomId || !rooms[roomId]) return;

      delete rooms[roomId];
      io.to(roomId).emit('opponent-left');
    });
  });
};
