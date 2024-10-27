const express = require('express');
const socket = require('socket.io');

const app = express();
const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

// listen
io.on('connection', (socket) => {
    socket.emit('updateData', tasks);
    socket.on('addTask', (newTask) => {
        tasks.push(newTask);
        socket.broadcast.emit('addTask', newTask);
    });
    socket.on('removeTask', id => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        tasks.splice(taskIndex, 1);
        socket.broadcast.emit('removeTask', id);
    });
});

const tasks = [];