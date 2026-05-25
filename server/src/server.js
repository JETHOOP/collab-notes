const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const testRoutes = require('./routes/testRoutes');

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5174';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('JavaScript backend running');
});

app.use('/api/test', testRoutes);

io.on('connection', (socket) => {
    console.log(`client connected: ${socket.id}`);

    socket.on('changed', (data) => {
        console.log('Realtime change received:', data);
        socket.broadcast.emit('update-frontend', data);
    });

    socket.on('disconnect', () => {
        console.log(`client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
