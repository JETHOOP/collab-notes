import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

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

app.use('/api/auth', authRoutes);

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
