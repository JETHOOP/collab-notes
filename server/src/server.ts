import express, { Request, Response } from 'express';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import testRoutes from "./routes/testRoutes";
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5174",
        methods:["GET" ,"POST","PUT","DELETE"]
    }
})

app.use(cors());
app.use(express.json());

app.get('/' , (req:Request , res:Response)=>{
    res.send("Typescript backend running")
})
app.use("/api/test", testRoutes);

io.on('connection' , (socket)=>{
    console.log(`client connected: ${socket.id}`);

    socket.on("changed",(data)=>{
        console.log("RealTime change recieved :" , data);
        socket.broadcast.emit('update-frontend',data)
    })

    socket.on("disconnect", () => {
        console.log(`👋 Client disconnected: ${socket.id}`);
    });
})

server.listen(4000 , ()=>{
    console.log(`server is running on por number 4000`)
})