import { useEffect, FC, useState } from "react";
import socketIO from 'socket.io-client';

import '../App.css';
import ChatBody from "../components/ChatBody";
import ChatHeader from "../components/ChatHeader";
import ChatFooter from "../components/ChatFooter";

const API_URL: string = import.meta.env.VITE_API_URL as string;
const socket = socketIO(API_URL as string);

const ChatRoom: FC = () => {

  const [numberOfMessages, setNumberOfMessages] = useState<number>(0);

  useEffect(() => {
    socket.emit('joined-user', {
      username: (JSON.parse(sessionStorage.user)).username,
      roomname: (document.URL).replace(`${import.meta.env.VITE_APP_URL}/chats/`, "")
    });
  }, []);

  useEffect(() => {
    socket.on('joined-user', (data: { room_id: string; username: string }) => {
      sessionStorage.setItem('room_id', data.room_id);
      console.log("User:- " + data.username + " joined room: " + data.room_id);
    });
  }, []);

  return (
    <div className="page-content page-container wrapper" id="page-content">
        <div className="box box-warning direct-chat direct-chat-warning">
          <ChatHeader numberOfMessages={numberOfMessages} />
          <ChatBody socket={socket} setNumberOfMessages={setNumberOfMessages} />
          <ChatFooter socket={socket} numberOfMessages={numberOfMessages} setNumberOfMessages={setNumberOfMessages} />
        </div>
    </div>
  );
}

export default ChatRoom;