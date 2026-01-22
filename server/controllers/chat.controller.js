module.exports = function (io) {
    let messages = [];

    io.on('connection', socket => {
        console.log('User connected:', socket.id);
        const onlineUser = io.engine.clientsCount;
        console.log('Online: ', onlineUser);

        io.emit('get-online-user', onlineUser);

        socket.hasJoined = false;

        socket.on('get-online-user-now', () => {
            socket.emit('get-online-user', io.engine.clientsCount);
        });

        socket.on('set-username', username => {
            socket.username = username;

            if (!socket.hasJoined) {
                socket.hasJoined = true;

                const joinMsg = {
                    system: true,
                    text: `${username} joined the chat`,
                };

                messages.push(joinMsg);
                io.emit('global-chat-update', messages);
            }
        });

        // send chat history to new user
        socket.on('get-chat-history', () => {
            socket.emit('global-chat-update', messages);
        })

        // receive message
        socket.on('send-global-message', text => {
            if (!socket.username) return;

            const msg = {
                username: socket.username,
                text,
                time: new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                })
            };

            messages.push(msg);

            if (messages.length > 100) {
                messages.shift();
            }

            io.emit('global-chat-update', messages);
        });

        // Handle when user disconnect or close game
        socket.on('disconnect', () => {
            console.log('User disconneted: ', socket.id);
            const onlineUser = io.engine.clientsCount;
            console.log('Online user: ', onlineUser);
            io.emit('get-online-user', onlineUser);

            if (socket.username) {
                const leaveMsg = {
                    system: true,
                    text: `${socket.username} left the chat`,
                };

                messages.push(leaveMsg);
                io.emit('global-chat-update', messages);
            }

            if (onlineUser === 0) {
                messages = [];
                console.log('All users left. Chat history cleared.');
            }

        })
    });
}