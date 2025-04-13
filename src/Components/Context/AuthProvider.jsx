import { createContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => JSON.parse(localStorage.getItem('authtokens')) || null);
  const [user, setUser] = useState(() => (authTokens ? jwtDecode(authTokens.access) : null));
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedTokens = JSON.parse(localStorage.getItem('authtokens'));
    if (storedTokens) {
      const decodedUser = jwtDecode(storedTokens.access);
      setAuthTokens(storedTokens);
      setUser(decodedUser);
      const lastPath = localStorage.getItem('lastPath');
      if (lastPath) {
        navigate(lastPath);  // Redirect to last accessed page if available
        localStorage.removeItem('lastPath');  // Clear after redirecting
      }
    }
    setLoading(false);
  }, [navigate]);

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authtokens');
    localStorage.removeItem('lastPath');
    navigate('/');
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    logoutUser
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
