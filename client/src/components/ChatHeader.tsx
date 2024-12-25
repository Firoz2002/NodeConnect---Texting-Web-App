import { FC, useState} from "react";
import { useNavigate } from 'react-router-dom';

import ConfirmPopup from "./ConfirmPopup";

export interface ChatHeaderProps {
    numberOfMessages: number
}

const API_URL: string = import.meta.env.VITE_API_URL as string;

const ChatHeader: FC<ChatHeaderProps> = ({ numberOfMessages }) => {

    const navigate = useNavigate();
    const [showConfirmPopup, setShowConfirmPopup] = useState<boolean>(false);

    const deleteChatHandler = () => {
        const chat_id = (document.URL).replace(`${import.meta.env.VITE_APP_URL}/chats/`, "");

        try {
            fetch(`${API_URL}/api/v1/chat/${chat_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then((res) => {
                if (res.status === 200) {
                    console.log("Chat deleted successfully");
                    setShowConfirmPopup(false);
                    navigate('/home');
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <header className="box-header with-border">

            <button>
                {/* Remove this class */}
                <i className="fa-solid fa-arrow-right" style={{marginRight: "10px", rotate: "180deg", padding: "5px"}} onClick={() => navigate(-1)}></i>
            </button>

            <h3 className="box-title">Chat Messages</h3>
            {
                showConfirmPopup ?
                    <ConfirmPopup 
                        action={deleteChatHandler}
                        showConfirmPopup={showConfirmPopup} 
                        setShowConfirmPopup={setShowConfirmPopup}  
                    />
                : null
            }

            <div className="box-tools pull-right mt-10">
                <span data-toggle="tooltip" title="" className="badge bg-yellow p-2 m-1" data-original-title="3 New Messages">{numberOfMessages}</span>
                <button type="button" className="btn btn-box-tool m-1" data-widget="collapse">
                    <i className="fa fa-minus fa-lg"></i>
                </button>
                <button type="button" className="btn btn-box-tool p-2 m-1" data-toggle="tooltip" title="" data-widget="chat-pane-toggle" data-original-title="Contacts">
                      <i className="fa fa-trash fa-lg" onClick={() => setShowConfirmPopup(true)}></i>
                </button>
                <button type="button" className="btn btn-box-tool p-2 m-1" data-widget="remove" onClick={() => { return navigate(-1) }}>
                    <i className="fa fa-times fa-lg"></i>
                </button>
            </div>
        </header>
    )
}

export default ChatHeader;