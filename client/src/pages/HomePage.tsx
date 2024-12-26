import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';

import { User } from '../types/user';
import HomeHeader from '../components/HomeHeader';
import HomeBody from '../components/HomeBody';

const API_URL: string = import.meta.env.VITE_API_URL as string;
const socket = socketIO(API_URL as string);

const HomePage: FC = () => {

    const navigate = useNavigate();
    const [friends, setFriends] = useState<User[]>([]);

    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        if (sessionStorage.user) {
            setCurrentUser(JSON.parse(sessionStorage.user));
        } else {
            navigate('/');
        }
    }, []);

    useEffect(() => {
        socket.emit('user-online', {
            username: (JSON.parse(sessionStorage.user)).username
        });
        
        fetch(`${API_URL}/api/v1/get-friends`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(async (res: Response) => {
            if (res.ok) {
                const data = await res.json();

                setFriends(data);
            } else if (res.status === 401) {
                navigate('/');
            }
        });
    }, []);

    const logoutHandler = () => {
        fetch(`${API_URL}/api/v1/logout`, { method: 'DELETE', credentials: 'include' })
        .then(res => res.json())
        .then((data) => {
            console.log(data.message);
            
            sessionStorage.removeItem('user');
            navigate('/');
        });
    }

    return (
        <div className="wrapper">
            <div className="box box-warning direct-chat direct-chat-warning">
                <HomeHeader friends={friends} logout={logoutHandler} profile_picture={currentUser?.profile} />
                <HomeBody friends={friends} socket={socket} />
            </div>
        </div>
    );
}

export default HomePage;