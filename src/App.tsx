import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import UserIdPage from './pages/StudentID';
import QRCodePage from './pages/QRCode';
import SuccessPage from './pages/Success';
import { Item } from './models';

export const AppContext = React.createContext<{
  mode: 'borrow' | 'return';
  qrcode: string;
  userId: string;
  item?: Item;
  setMode: (e: React.SetStateAction<'borrow' | 'return'>) => void;
  setQRCode: (e: React.SetStateAction<string>) => void;
  setUserId: (e: React.SetStateAction<string>) => void;
  setItem: (e: React.SetStateAction<Item | undefined>) => void;
}>({
  mode: 'borrow',
  qrcode: '',
  userId: '',
  item: undefined,
  setMode: (e) => {},
  setQRCode: (e) => {},
  setUserId: (e) => {},
  setItem: (e) => {},
});

function App() {

  const [mode, setMode] = useState<'borrow' | 'return'>('borrow');
  const [qrcode, setQRCode] = useState('');
  const [userId, setUserId] = useState('');
  const [item, setItem] = useState<Item | undefined>();

  return (
    <div className='app'>
      <AppContext.Provider value={{
        // getters
        mode,
        qrcode,
        userId,
        item,
        // setters
        setMode,
        setQRCode,
        setUserId,
        setItem,
      }}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/qrcode" element={<QRCodePage/>} />
            <Route path="/user-id" element={<UserIdPage/>} />
            <Route path="/success" element={<SuccessPage/>} />
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
