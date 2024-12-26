import { FC, ChangeEvent, FormEvent, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';
import useOutsideClick from '../helper/useOutsideClick';

type PopupProps = { togglePopup: (modalType: string) => void };

const SignIn: FC<PopupProps> = ({ togglePopup }) => {

  const navigate = useNavigate();
  const popupRef = useRef<HTMLFormElement>(null);

  const [username, setUsername] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");

  const API_URL: string = import.meta.env.VITE_API_URL as string;
  
  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/v1/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status == 201) {
        sessionStorage.setItem('user', JSON.stringify(data.data));
        navigate('/home');

      } else {
        setError(data.message);
        console.error("Failed to login");
      }
    } catch (error) {
      console.error("An error occurred while logging in", error);
    }
  }

  useOutsideClick(popupRef, () => togglePopup(''));

  return (
    <div className="signup-form popup">
      <form className="popup-inner rounded p-4 pb-0" onSubmit={formSubmitHandler} ref={popupRef}>
        
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} required/>
        </div>

        <div className="form-group">
          <label>Password </label>
          <input type="password" value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required/>
        </div>

        <p style={{color: "red"}}> {error} </p>

        <div className="form-group" style={{display:"inline-block"}}>
          <button type="submit">Sign Up</button>
          <span className="ms-2 text-muted text-decoration-dotted"> terms & conditions </span>
        </div>
      </form>
    </div>
  )
}

export default SignIn;