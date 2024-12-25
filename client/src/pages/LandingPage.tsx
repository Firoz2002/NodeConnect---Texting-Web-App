import { FC, useState } from 'react';

import '../App.css';

import Navbar from '../components/Navbar';
import LoginPopup from '../components/LoginPopup';
import RegisterPopup from '../components/RegisterPopup';

const LandingPage: FC = () => {

    const [popup, setPopup] = useState<boolean>(false);
    const [popupType, setPopupType] = useState<string>("");

    const togglePopup = (modalType: string) => {
        setPopup(!popup);
        setPopupType(modalType);
    }

    return (
        <>
            <Navbar togglePopup={togglePopup} />
            <div className="container homepage">
                <div className="row">
                    <div className="col" style={{ padding: "1rem" }}>

                        <h1 className="row">Start a beautiful journey to <u>friendship</u></h1>

                        <div className="row" style={{ paddingTop: "2rem" }}>
                            <div className="direct-chat-msg left" style={{ maxWidth: "350px" }}>
                                <img className="direct-chat-img" src="https://img.icons8.com/color/36/000000/person-female.png" alt="user-profile-pic" />
                                <p className="direct-chat-text">
                                    Hello! How are you?
                                </p>
                            </div>

                            <div className="direct-chat-msg right" style={{ maxWidth: "350px" }}>
                                <img className="direct-chat-img" src="https://img.icons8.com/color/48/administrator-male--v1.png" alt="user-profile-pic" />
                                <p className="direct-chat-text" style={{ color: "white", background: "#f39c12" }}>
                                    I am fine, What about you?
                                </p>
                            </div>

                            <div className="direct-chat-msg left" style={{ maxWidth: "350px" }}>
                                <img className="direct-chat-img" src="https://img.icons8.com/color/36/000000/person-female.png" alt="user-profile-pic" />
                                <p className="direct-chat-text">
                                    Good as always
                                </p>
                            </div>
                        </div>

                        <button className="mt-4 m-2 w-80 cursor-pointer group rounded-pill px-5 py-2" onClick={() => setPopup(true)}>
                            Let's Start
                        </button>
                    </div>
                    <div className="col">
                        <div className="row-lg">
                            <img src="https://res.cloudinary.com/dhlsmeyw1/image/upload/v1735118667/NodeConnect%20assets/img-1_zee3n7.webp" alt="img-1" style={{ width: "250px", float: "right" }} />
                        </div>
                    </div>

                    { popup ? 
                        popupType === "login" ? 
                            <LoginPopup togglePopup={togglePopup} /> : 
                            <RegisterPopup togglePopup={togglePopup} /> 
                    : null }
                </div>
            </div>
        </>
    )
}

export default LandingPage;