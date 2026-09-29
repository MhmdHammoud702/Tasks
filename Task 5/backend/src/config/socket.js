import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
  },
});


const onlineSockets = new Set();
const recentActivity = [];
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    onlineSockets.add(socket.id);
    console.log("Currently online:", [...onlineSockets]);
    io.emit("onlineUsersCount", onlineSockets.size);
    recentActivity.length == 4 ? recentActivity.pop() : "";
    recentActivity.unshift("User Connected")
    io.emit('activity',recentActivity)
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        onlineSockets.delete(socket.id);
        console.log("Currently online:", [...onlineSockets]);
        io.emit("onlineUsersCount", onlineSockets.size);
        recentActivity.length == 4 ? recentActivity.pop() : "";
        recentActivity.unshift("User Disconnected")
        io.emit('activity',recentActivity)
    });
});

export { io, app, server };