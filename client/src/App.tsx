import { FC } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/HomePage';
import ChatRoom from './pages/ChatPage';
import LandingPage from './pages/LandingPage';
import FriendsPage from './pages/FriendsPage';

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'>
          <Route index element={<LandingPage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/find-friends' element={<FriendsPage />} />
          <Route path='/chats/:id' element={<ChatRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
};

export default App;