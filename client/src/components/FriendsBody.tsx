import { useEffect, useState, FC } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { User } from '../types/user';
import { FriendRequest } from '../types/friendRequest';

const API_URL: string = import.meta.env.VITE_API_URL as string;

interface FriendsBodyProps {
    requestHandler: (user: User) => void
}


const FriendsBody: FC<FriendsBodyProps> = ({ requestHandler }) => {

    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);

    const current_user: string = JSON.parse(sessionStorage.user).id as string;
    const [friendRequests, setFriendRequests] = useState<{ friendRequestSent: FriendRequest[], friendRequestReceived: FriendRequest[]}>({ friendRequestSent: [], friendRequestReceived: [] });
    
    const [friendRequestSentToUser, setFriendRequestSentToUser] = useState<User[]>([]);
    const [friendRequestReceivedFromUser, setFriendRequestReceivedFromUser] = useState<User[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/api/v1/friend-requests`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        .then(res => res.json())
        .then((data: { friendRequestSent: FriendRequest[], friendRequestReceived: FriendRequest[] }) => {
            console.log(data);
            setFriendRequests(data);
        });
    }, []);

    useEffect(() => {
        try {
            fetch(`${API_URL}/api/v1/get-users`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })
            .then(async (res) => {
                const data = await res.json();
    
                if(res.status === 200) {
                    setUsers(data.data.addFriends);
                    
                    setFriendRequestSentToUser(data.data.friendRequestsSent);
                    setFriendRequestReceivedFromUser(data.data.friendRequestsReceived);

                } else if(res.status === 401) {
                    navigate('/');
                } else {
                    console.log(data.message);
                }
            })
        } catch (err) {
            console.error("Something went wrong: " + err);   
        }
    }, []);

    const requestStatusHandler = (request: FriendRequest, status: string) => {
        try {
            fetch(`${API_URL}/api/v1/friend-request/${request._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: status
                })
            })
            .then(res => res.json())
            .then(data => {
                setFriendRequestReceivedFromUser(friendRequestReceivedFromUser.filter((user: User) => user._id !== data.data.sentBy));
                console.log(data.message);
            });
        } catch (err) {
            console.error("Something went wrong: " + err);
        }
    };

  return (
    <main>
    {
        <div className="m-3">
            {
                (users.length) ?
                    <>
                        <h6 className='mb-3'> Add Friends :-</h6>
                        { 
                            users.map((user: User, index: number) => (
                            <div className="user-contact bg-white border d-flex justify-content-between" key={index}>
                                <div className="d-flex align-items-center">
                                    <img className="direct-chat-img" src={user.profile} alt="user-profile-pic"/>
                                    <span className=""> { user.username } </span>
                                </div>
                                <Button className="btn" onClick={() => requestHandler(user)}> Add Friend </Button>
                            </div>
                            ))
                        }
                    </>
                : null
            }
        </div>
    }

    {
    friendRequests.friendRequestReceived.length && friendRequests.friendRequestReceived.filter((request: FriendRequest) => request.sentTo === current_user).length
    ? <div className="m-3">
        <h6 className='mb-3'>Friend Requests Received:-</h6>
        { friendRequests.friendRequestReceived.map((request: FriendRequest) => (
            friendRequestReceivedFromUser.filter((user: User) => user._id === request.sentBy).map((user: User) => (
                <div className="user-contact bg-white border d-flex justify-content-between" key={request._id}>
                    <div className="d-flex align-items-center">
                        <img className="direct-chat-img" src={user.profile} alt="user-profile-pic"/>
                        <span className=""> { user.username } </span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                    <Button className="btn" style={{ backgroundColor: "#63cc00"}} onClick={() => requestStatusHandler(request, "accepted")}> Accept </Button>
                    <Button className="btn" style={{ backgroundColor: "#DC143C"}} onClick={() => requestStatusHandler(request, "declined")}> Decline </Button>
                    </div>
                </div>
            ))
        ))}
    </div>
    : null
    }

    {
        friendRequests.friendRequestSent.length && friendRequests.friendRequestSent.filter((request: FriendRequest) => request.sentBy === current_user).length ? 
            <div className="m-3">
                <h6 className='mb-3'>Friend Requests Sent:-</h6>
                { friendRequests.friendRequestSent.filter((request: FriendRequest) => request.sentBy === current_user).map((request: FriendRequest) => (
                    friendRequestSentToUser.filter((user: User) => user._id === request.sentTo).map((user: User) => (
                        <div className="user-contact bg-white border d-flex justify-content-between align-items-center" key={request._id}>
                            <div className="d-flex align-items-center">
                                <img className="direct-chat-img" src={user.profile} alt="user-profile-pic"/>
                                <span className=""> { user.username } </span>
                            </div>
                            <p> { request.status } </p>
                        </div>
                    ))
                ))
                }
            </div>
        : null
    }
    </main>
  )
}

export default FriendsBody;