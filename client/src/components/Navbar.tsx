import { FC } from "react";
import { Outlet } from "react-router-dom";

import '../App.css';

type NavbarProps = { togglePopup: (modalType: string) => void };
const Navbar: FC<NavbarProps> = ({ togglePopup }) => (
    <>
        <nav className="p-2 fs-5">
            <ul className="w-100 d-flex justify-content-between list-unstyled p-2 border-bottom border-dark">
                <li className="ms-3 text-decoration-none">
                    <button> Home </button>
                </li>
                <li>
                    <button onClick={() => togglePopup('login')}> Login </button> 
                    <span> | </span> 
                    <button onClick={() => togglePopup('register')}> Register </button>
                </li>
            </ul>
        </nav>

        <Outlet/>
    </>
);

export default Navbar;