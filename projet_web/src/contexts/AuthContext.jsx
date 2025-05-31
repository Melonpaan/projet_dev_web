import { createContext, useContext, useState, useEffect } from 'react';
import { authenticate, registerUser } from '../services/userService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  // Persister user à chaque changement
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (username, password) => {
    const u = await authenticate({ username, password });
    setUser(u);
    return u;
  };

  const register = async ({ username, email, password, confirmPassword, firstName, lastName, dateOfBirth }) => {
    await registerUser({ username, email, password, confirmPassword, firstName, lastName, dateOfBirth });
    // après inscription, on peut auto-connecter
    return login(username, password);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
