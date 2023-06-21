import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* <Route path="/teacher/dashboard" element={<Register />} />
        <Route path="/student/dashboard" element={<Register />} />
        
        <Route path="/teacher/" element={<Register />} />
        <Route path="/teacher/:courseId/participants" element={<Register />} />
        <Route path="/" element={<Register />} />
        <Route path="/" element={<Register />} /> */}

      </Routes>
    </BrowserRouter>

  );
}

export default App;
