import React, { FC, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { User } from '../types/user';
import { FriendRequest } from '../types/friendRequest';

const API_URL: string = import.meta.env.VITE_API_URL as string;

const FriendsPage: FC = () => {
    const navigate = useNavigate();
    const popupRef = useRef<HTMLFormElement>(null);
    
    const current_user: string = JSON.parse(sessionStorage.user).id as string;

    const [users, setUsers] = useState<User[]>([]);
    const [foundUser, setFoundUser] = useState<User[]>([]);
    
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

    const requestHandler = (user: User) => {
        try {
            fetch(`${API_URL}/api/v1/friend-request`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    sentTo: user._id
                })
            })
            .then(res => res.json())
            .then(data => {
                
                setFriendRequestSentToUser([...friendRequestSentToUser, user]);
                setFriendRequests({ ...friendRequests, friendRequestSent: [...friendRequests.friendRequestSent, data.data] });

                setUsers(users.filter((user: User) => user._id !== data.data.sentTo));
                
                console.log(data.message);
            });

        } catch (err) {
            console.error("Something went wrong: " + err);
        }
    };

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

    const searchHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            fetch(`${API_URL}/api/v1/find-user?username=${event.currentTarget.search.value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            })
            .then(async (res) => {
                const data = await res.json();
    
                if(res.status === 200) {
                    setFoundUser([data]);
                } else {
                    console.log(data.message);
                }
            });  
        } catch (err) {
            console.error("Something went wrong: " + err);
        }
    };

    return (
        <div className="wrapper">
                <div className="box box-warning direct-chat direct-chat-warning">
                    <header className="box-header with-border d-flex align-items-center">
                        <i className="fa-solid fa-arrow-right" style={{marginRight: "10px", rotate: "180deg", padding: "5px", cursor: "pointer"}} onClick={() => navigate(-1)}></i>
                        <h1 className="box-title " style={{marginRight: "auto"}}>Find Friends</h1>

                        <form className='d-flex search-bar' onSubmit={searchHandler} ref={popupRef}>
                            <input type="text" placeholder="Search for . . ." name="search" onChange={() => {}} className='rounded-3 border p-1'/>
                            <button type="submit">
                                <i className="fa fa-search"></i>
                            </button>
                        </form>
                    </header>

                    <div className="w-100 mt-3">
                            {foundUser && foundUser.length
                                ? foundUser.map((user, index) => (
                                    (user?.username) ?
                                        <div className="user-found" key={index}>
                                            <div className="user-profile d-flex justif" style={{ display: "flex", alignItems: "center" }} key={index}>
                                                <img className="direct-chat-img" src={user.profile} alt="user-profile-pic" />
                                                <span><b>{user.username}</b></span>
                                                <button className="btn" onClick={() => console.log("Hello")}> Add Friend </button>
                                            </div>
                                        </div>
                                    : <div className="wrapper" key={index}><p> {user.username} </p></div>
                                ))
                            : null}
                    </div>

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
                        friendRequests.friendRequestSent.length && friendRequests.friendRequestSent.filter((request: FriendRequest) => request.sentBy === current_user).length
                        ? <div className="m-3">
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
                </div>
        </div>
    );
};

export default FriendsPage;