import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, getUserProfile } from '../services/authService';
import { setAuthToken, getAuthToken, removeAuthToken, setAuthUserId } from '../utils/tokenUtils';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        setAuthToken(token);
        const userData = await getUserProfile();
        setCurrentUser(userData);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    }
    
    loadUser();
  }, []);

  // Add this function to update user data
  const updateUser = (userData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  async function login(email, password) {
    setError(null);
    try {
      const { token, user } = await loginUser(email, password);
      setAuthToken(token);
      setAuthUserId(user);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to login');
      throw err;
    }
  }

  async function register(name, email, password) {
    setError(null);
    try {
      const { token, user } = await registerUser(name, email, password);
      setAuthToken(token);
      setAuthUserId(user);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to register');
      throw err;
    }
  }

  function logout() {
    removeAuthToken();
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    setCurrentUser: updateUser, // Add this line to expose the update function
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}