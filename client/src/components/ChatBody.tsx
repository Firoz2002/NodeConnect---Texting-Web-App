import { FC, useRef, useEffect, useState } from 'react';
import moment from 'moment';

import '../App.css';
import { User } from '../types/user';
import { Message } from '../types/message';

interface ChatBodyProps {
    socket: any;
    setNumberOfMessages: (numberOfMessages: number) => void
}

const APP_URL: string = import.meta.env.VITE_APP_URL as string;
const API_URL: string = import.meta.env.VITE_API_URL as string;

const ChatBody: FC<ChatBodyProps> = ({ socket, setNumberOfMessages }) => {

    const [user, setUser] = useState<User | null>();
    const [messages, setMessages] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const chat_id: string = (document.URL).replace(`${APP_URL}/chats/`, "");

    useEffect(() => {
      fetch(`${API_URL}/api/v1/chat/${chat_id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      .then(res => res.json())
      .then((data: Message[]) => {
        setMessages(data);
        setNumberOfMessages(data.length);

        data.forEach((message) => {
          socket.emit('load-chat', {
            sendBy: message.sendBy,
            sendTo: message.sendTo,
            message: message.message,
            timestamp: message.createdAt
          });
        });
      });
    }, []);

    useEffect(() => {
        scrollToBottom();
        setUser(JSON.parse(sessionStorage.user));
    }, [messages]);

    useEffect(() => { 
      socket.on('chat', (message: Message) => {
        setMessages((prevState) => [...prevState, message]);
      });
      
      return () => {
        socket.off('chat');
      }
    }, []);

    return (
        <main className="box-body">
            <div className="direct-chat-messages">
                {messages && messages.length
                    ? messages.map((data: Message, index: number) => (
                        <div className={`direct-chat-msg ${(data.sendBy === user?.username) ? 'right' : 'left'}`} key={index}>
                            <div className={`direct-chat-info clearfix  ${(data.sendBy === user?.username) ? 'text-end' : 'text-start'}`}>
                                <span className="direct-chat-name">{data.sendBy}</span>
                                <span className="direct-chat-timestamp">{moment(data.createdAt).format('DD-MMMM hh:mm')}</span>
                            </div>
                            <img className="direct-chat-img" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="user-profile-pic" />
                            <div className="direct-chat-text">
                                {data.message}
                            </div>
                        </div>
                    ))
                    : null}
                <div ref={messagesEndRef} />
            </div>
        </main>
    );
};

export default ChatBody;