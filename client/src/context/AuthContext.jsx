import { useState, useEffect } from 'react';
import { AuthContext } from './authContextInstance';
import {
  loginUser,
  registerUser,
  getUserProfile,
  getToken,
  getUser,
  clearAuth
} from '../services/authService';

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    let isMounted = true;
    const existingToken = getToken();

    if (existingToken) {
      getUserProfile()
        .then((res) => {
          if (isMounted && res && res.user) {
            setUserState(res.user);
          }
        })
        .catch(() => {
          // Token invalid or expired
          if (isMounted) {
            clearAuth();
            setTokenState(null);
            setUserState(null);
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    if (data && data.token) {
      setTokenState(data.token);
      setUserState(data.user || null);
    }
    return data;
  };

  const register = async (name, email, password) => {
    return registerUser({ name, email, password });
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
