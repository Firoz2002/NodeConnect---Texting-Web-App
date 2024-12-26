import React, { FC, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { User } from '../types/user';

interface FriendsHeaderProps {
    
}

const API_URL: string = import.meta.env.VITE_API_URL as string;

const FriendsHeader: FC<FriendsHeaderProps> = () => {

    const navigate = useNavigate();
    const popupRef = useRef<HTMLFormElement>(null);
    const [foundUser, setFoundUser] = useState<User[]>([]);


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
    <header className="box-header with-border d-flex align-items-center">
        <i className="fa-solid fa-arrow-right" style={{marginRight: "10px", rotate: "180deg", padding: "5px", cursor: "pointer"}} onClick={() => navigate(-1)}></i>
        <h1 className="box-title " style={{marginRight: "auto"}}>Find Friends</h1>

        <form className='d-flex search-bar' onSubmit={searchHandler} ref={popupRef}>
            <input type="text" placeholder="Search for . . ." name="search" onChange={() => {}} className='rounded-3 border p-1'/>
            <button type="submit">
                <i className="fa fa-search"></i>
            </button>
        </form>

        <div className="w-100 mt-3">
            {
                foundUser && foundUser.length
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
                : null
            }
        </div>
    </header>
  )
}

export default FriendsHeader;