import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('travelmate_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/profile');
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem('travelmate_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('travelmate_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(data) {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('travelmate_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem('travelmate_token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
