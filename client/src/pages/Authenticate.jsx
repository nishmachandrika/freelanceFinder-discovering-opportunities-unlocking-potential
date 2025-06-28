import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Login from '../components/Login';
import Register from '../components/Register';
// In src/pages/Authenticate.jsx
import '../styles/freelancer/authenticate.css'; // Two levels up

const Authenticate = () => {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState('login'); 
  return (
    <div className="AuthenticatePage">
      <div className="auth-navbar">
        <h3 onClick={() => navigate('/')}>SB Works</h3>
        <p onClick={() => navigate('/')}>Home</p>
      </div>

      
      {authType === 'login' ? (
        <Login setAuthType={setAuthType} />
      ) : (
        <Register setAuthType={setAuthType} />
      )}
    </div>
  );
};

export default Authenticate;
