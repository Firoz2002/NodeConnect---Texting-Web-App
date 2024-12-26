import React, { FC, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useOutsideClick from '../helper/useOutsideClick';
import { Dropdown } from 'react-bootstrap';

import { User } from '../types/user';

interface HomeHeaderProps {
    friends: User[];
    logout: () => void
    profile_picture: string | undefined
}

const MessengerHeader: FC<HomeHeaderProps> = ({ friends, logout, profile_picture }) => {
    const [userToFind, setUserToFind] = useState<string>('');
    const [searchedUser, setSearchedUser] = useState<User | null>(null);

    const navigate = useNavigate();
    const searchBarRef = useRef<HTMLFormElement>(null);
    const userProfileRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.preventDefault();
        setUserToFind(e.target.value);
        const contactsElement = document.querySelector('.contacts') as HTMLElement;
        if (contactsElement) {
            contactsElement.style.opacity = "0.3";
        }
    }

    const searchHandler = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const foundUser = friends.find(friend => friend.username === userToFind);
        if(foundUser) {
            setSearchedUser(foundUser);
        }
    }

    useOutsideClick(searchBarRef, () => {
        setUserToFind('');
        const contactsElement = document.querySelector('.contacts') as HTMLElement;
        if (contactsElement) {
            contactsElement.style.opacity = "1";
        }
        const inputElement = document.querySelector('.search-bar input') as HTMLInputElement;
        if (inputElement) {
            inputElement.value = '';
        }
    });
    
    useOutsideClick(userProfileRef, () => {
        setSearchedUser(null);
    })

    return (
        <header className="wrapper">
            <div className="messenger-header d-flex box-header w-100">
                <button className="ms-2" onClick={() => { return navigate('/find-friends') }}>
                    <i className="fa-solid fa-user-plus fa-lg"></i>
                </button>

                <form className="search-bar" onSubmit={searchHandler} ref={searchBarRef}>
                    <input type="text" placeholder="Get chat . . ." name="search" onChange={handleSearch} />
                    <button type="submit">
                        <i className="fa fa-search"></i>
                    </button>
                </form>

                <Dropdown>
                    <Dropdown.Toggle style={{ background: "none", border: "none", outline: "none" , padding: "0"}}>
                        <img className="direct-chat-img border border-solid border-black" src={profile_picture} alt="profile-pic" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { console.log('Profile') }}>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={() => { console.log('Settings') }}>Settings</Dropdown.Item>
                        <Dropdown.Item onClick={() => { return logout() }}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {
            searchedUser
                ?
                <div className="w-100 p-3 pt-0" ref={userProfileRef}>
                    <div className="user-contact" key={searchedUser._id}>
                        <img className="direct-chat-img" src={searchedUser.profile} alt="user-profile-pic"/>
                        <span onClick={() => navigate(`/chats/${searchedUser.username}`)}> { searchedUser.username } </span>
                    </div>
                </div>
            : null
            }
        </header>
    );
}

export default MessengerHeader;