const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const testRoutes = require("./routes/testRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5174",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("Javascript backend running");
});
app.use("/api/test", testRoutes);

io.on('connection', (socket) => {
    console.log(`client connected: ${socket.id}`);

    socket.on("changed", (data) => {
        console.log("RealTime change recieved :", data);
        socket.broadcast.emit('update-frontend', data);
    });

    socket.on("disconnect", () => {
        console.log(`👋 Client disconnected: ${socket.id}`);
    });
});

server.listen(4000, () => {
    console.log(`server is running on port number 4000`);
});
