// Node server which will handel socket io connections

const { Server } = require('socket.io');
const io = new Server(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});
console.log("The Server has been started successfully on port 8000");

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        //console.log("New user", name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});