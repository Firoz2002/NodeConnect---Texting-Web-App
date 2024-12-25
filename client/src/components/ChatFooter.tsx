import React, { FC, ChangeEvent, KeyboardEvent } from "react";
import { useState } from "react";

interface ChatFooterProps {
    socket: any;
    numberOfMessages: number
    setNumberOfMessages: (numberOfMessages: number) => void
}

const APP_URL: string = import.meta.env.VITE_APP_URL as string;
const API_URL: string = import.meta.env.VITE_API_URL as string;

const ChatFooter: FC<ChatFooterProps> = ({ socket, numberOfMessages, setNumberOfMessages }) => {

    const receiver = (document.URL).replace(`${APP_URL}/chats/`, "");
    const [message, setMessage] = useState<string>("Type Message ...");

    const handleSendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        fetch(`${API_URL}/api/v1/chat`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                receiver_id: receiver,
                message: message
            })
        })
        .then((res) => {
            if (res.status === 200) {
                socket.emit('chat', {
                    sendBy: JSON.parse(sessionStorage.user).username,
                    sendTo: receiver,
                    message: message,
                    room_id: sessionStorage.room_id
                });
                
                setMessage('');
                setNumberOfMessages(numberOfMessages+1);

                const inputElement = document.querySelector('.form-control') as HTMLInputElement;
                if (inputElement) {
                    inputElement.value = '';
                }
            } else {
                console.log("Error");
            }
        });
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setMessage(e.target.value);
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
        }
    }

    return (
        <footer className="box-footer">
            <form onSubmit={handleSendMessage}>
                <div className="input-group">
                    <input type="text" name="message" placeholder="Type Message ..." className="form-control" onChange={handleChange} onKeyDown={handleKeyDown} />
                    <span className="input-group-btn">
                        <button type="submit" className="btn btn-warning btn-flat">Send</button>
                    </span>
                </div>
            </form>
        </footer>
    )
}

export default ChatFooter;