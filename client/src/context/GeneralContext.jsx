import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export const GeneralContext = createContext();

export function GeneralContextProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem('auth');
    return storedAuth 
      ? JSON.parse(storedAuth) 
      : { username: '', email: '', password: '', usertype: '' };
  });

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:6001', {
      withCredentials: true,
      autoConnect: false,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (auth.email) {
      localStorage.setItem('auth', JSON.stringify(auth));
    }
  }, [auth]);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      setAuth(response.data.user);
      socket?.connect();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      setAuth(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = () => {
    socket?.disconnect();
    setAuth({ username: '', email: '', password: '', usertype: '' });
    localStorage.removeItem('auth');
  };

  return (
    <GeneralContext.Provider value={{ auth, setAuth, login, register, logout, socket }}>
      {children}
    </GeneralContext.Provider>
  );
}
