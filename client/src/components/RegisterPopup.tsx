import { FC, useState, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../App.css';
import useOutsideClick from '../helper/useOutsideClick';

const API_URL: string = import.meta.env.VITE_API_URL as string;

type PopupProps = { togglePopup: (modalType: string) => void };
const SignUp: FC<PopupProps> = ({ togglePopup }) => {

  const navigate = useNavigate();
  const popupRef = useRef<HTMLFormElement>(null);

  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>(""); 
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [selectedPicture, setSelectedPicture] = useState({ id: 1, src: 'https://img.icons8.com/color/48/administrator-male--v1.png' });

  const [error, setError] = useState<string>("");

  const pictures = [
    { id: 1, src: 'https://img.icons8.com/color/48/administrator-male--v1.png' },
    { id: 2, src: 'https://img.icons8.com/color/48/user.png' },
    { id: 3, src: 'https://img.icons8.com/color/48/guest-male.png' },
    { id: 4, src: 'https://img.icons8.com/color/48/person-female.png' },
    { id: 5, src: 'https://img.icons8.com/color/48/bodyguard-female.png' },
  ];

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if(username.includes(' ')) {
      setError('Username cannot contain spaces'); 
      return;
    } else if(password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const res = await fetch(`${API_URL}/api/v1/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email,
        username: username,
        password: password,
        profile: selectedPicture.src
      })
    })
    
    const data = await res.json();

    if (res.status == 201) {
      sessionStorage.setItem('user', JSON.stringify(data.data));
      navigate('/home');

    } else {
      setError(data.message);
      console.error("Failed to register");
    }
  }

  const handlePictureSelect = (picture: any) => {
    setSelectedPicture(picture);
  };

  useOutsideClick(popupRef, () => togglePopup(''));

  return (
    <div className="signup-form popup rounded-3">
      <form onSubmit={formSubmitHandler} className="popup-inner rounded-3 shadow p-4 pb-0" ref={popupRef}>
        <div className="profile-pictures">
          {
            pictures.map(picture => (
              <img
                key={picture.id}
                src={picture.src}
                alt="profile picture"
                className={`profile-picture ${selectedPicture && selectedPicture.id === picture.id ? 'selected' : ''}`}
                onClick={() => handlePictureSelect(picture)}
              />
            ))
          }
        </div>
        <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label>Password <span>(*6 or more characters required)</span> </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
        </div>

        <p style={{color: "red"}}> {error} </p>

        <div className="form-group" style={{display:"inline-block"}}>
            <button type="submit">Sign Up</button>
            <span className="ms-2 text-muted text-decoration-dotted" >terms & conditions</span>
        </div>
      </form>
    </div>
  );
}

export default SignUp;