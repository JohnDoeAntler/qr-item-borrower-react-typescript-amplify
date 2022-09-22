import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home';
import StudentIDPage from './pages/StudentID';
import QRCodePage from './pages/QRCode';
import SuccessPage from './pages/Success';
import { Item } from './models';

export const AppContext = React.createContext<{
  mode: 'borrow' | 'return';
  qrcode: string;
  studentId: string;
  item?: Item;
  setMode: (e: React.SetStateAction<'borrow' | 'return'>) => void;
  setQRCode: (e: React.SetStateAction<string>) => void;
  setStudentId: (e: React.SetStateAction<string>) => void;
  setItem: (e: React.SetStateAction<Item | undefined>) => void;
}>({
  mode: 'borrow',
  qrcode: '',
  studentId: '',
  item: undefined,
  setMode: (e) => {},
  setQRCode: (e) => {},
  setStudentId: (e) => {},
  setItem: (e) => {},
});

function App() {

  const [mode, setMode] = useState<'borrow' | 'return'>('borrow');
  const [qrcode, setQRCode] = useState('');
  const [studentId, setStudentId] = useState('');
  const [item, setItem] = useState<Item | undefined>();

  return (
    <div className='app'>
      <AppContext.Provider value={{
        // getters
        mode,
        qrcode,
        studentId,
        item,
        // setters
        setMode,
        setQRCode,
        setStudentId,
        setItem,
      }}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/qrcode" element={<QRCodePage/>} />
            <Route path="/student-id" element={<StudentIDPage/>} />
            <Route path="/success" element={<SuccessPage/>} />
          </Routes>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
