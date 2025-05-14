import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('auth_token');
      const user = AuthService.getCurrentUser();

      setIsAuthenticated(!!token);
      setCurrentUser(user);
      setIsAdminUser(user.admin);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, password_confirmation) => {
    try {
      const response = await AuthService.signup(email, password, password_confirmation);
      setCurrentUser(response.data);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    isAdminUser,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};