import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SurfSpots from './pages/SurfSpots';
import SpotDetail from './pages/SpotDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Community from './pages/Community';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="spots" element={<SurfSpots />} />
        <Route path="spots/:id" element={<SpotDetail />} />
        <Route path="community" element={<Community />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;