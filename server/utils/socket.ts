import { Server } from "socket.io";

import { getRoom } from "../controllers/room-controller";

interface User {
    username: string;
    socketId: string;
}

interface Message {
    sendBy: string,
    sendTo: string,
    message: string,
    room_id: string
}

let onlineUsers: User[] = [];
export default function socket(io: Server) {

    io.on("connection", (socket) => {
        socket.on("user-online", (data: { roomId: string; username: string }) => {
            if(!onlineUsers.some(user => user.username === data.username)) onlineUsers.push({ username: data.username, socketId: socket.id });
            console.log(onlineUsers);
            io.emit("online-users", onlineUsers);
        });

        socket.on("joined-user", async (data: { roomname: string; username: string }) => {
            const room = await getRoom(data);

            const room_id: number = room?._id as number;

            socket.join(room_id.toString());

            io.to(room_id.toString()).emit("joined-user", { username: data?.username, room_id: room?._id });
        });

        socket.on("load-chat-messages", (data: {
            sendBy: string,
            sentTo: string,
            message: string,
            timestamp: Date
        }) => {
            const rooms = Array.from(socket.rooms);
            const socketId: any = rooms[0];
            io.to(socketId).emit("chat", data);
        });

        socket.on("chat", (message: Message) => {
            io.to(message.room_id).emit("chat", message);
        });

        socket.on("typing", (data) => {
            socket.broadcast.to(data.roomname).emit("typing", data.username);
        });

        socket.on("disconnecting", () => {
            onlineUsers = onlineUsers.filter((user) => user.socketId != socket.id);
            io.emit("online-users", onlineUsers);
        });
    });
}