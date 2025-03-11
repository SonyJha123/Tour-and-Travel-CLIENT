import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import BasicInfo from './Pages/basicInfo/BasicInfo';
import Header from './Components/header/Header';
import Room from './Pages/room/Room';
import Faclities from './Pages/facilities/Facilities';
import Dashboard from './Pages/dashboard/Dashboard';
import Login from './Pages/login/Login';
import Register from './Pages/register/Register';
import HotelPdfDocument from './Pages/HotelPdfDocument';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<BasicInfo />} />
        <Route path="/room" element={<Room />} />
        <Route path="/facilities" element={<Faclities />} />
        <Route path="/test" element={<HotelPdfDocument />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;


