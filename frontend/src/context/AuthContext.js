import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/token', formData);
    const { access_token } = response.data;
    
    localStorage.setItem('token', access_token);
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    await fetchUser();
    return response.data;
  };

  const register = async (email, password, fullName) => {
    try {
      const response = await api.post('/register', {
        email,
        password,
        full_name: fullName
      });
      
      // Auto-login after registration
      await login(email, password);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        throw error;
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        throw new Error('Impossible de se connecter au serveur. Vérifiez que le backend est lancé sur http://localhost:8000');
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        throw new Error('Erreur lors de la configuration de la requête');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
