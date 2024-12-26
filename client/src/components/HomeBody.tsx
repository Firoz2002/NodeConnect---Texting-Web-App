import { useEffect, useState, FC } from "react";
import { useNavigate} from 'react-router-dom';

import '../App.css'
import { User } from "../types/user";

interface HomeBodyProps {
    socket: any;
    friends: User[];
}

const MessengerBody: FC<HomeBodyProps> = (props) => {
    const navigate = useNavigate();
    const socket: any = props.socket;

    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        socket.on('online-users', (users: string[]) => {
            setOnlineUsers(users);
        });
    }, [socket]);

    return (
        <main className="box-body p-3 pt-0">
            <h4> Friends </h4>
            {
            props.friends && props.friends.length
                ? props.friends.map((friend: User, index: number) => (
                    <div className="user-contact" key={index}>
                        <img className="direct-chat-img" src={friend.profile} alt="user-profile-pic"/>
                        <span className={ (onlineUsers.some(user => user.toString() === friend.username)) ? "status active": undefined }></span>
                        <span onClick={() => navigate(`/chats/${friend.username}`)}> { friend.username } </span>
                    </div>
                ))
                : null
            }
        </main>
    )
}

export default MessengerBody;