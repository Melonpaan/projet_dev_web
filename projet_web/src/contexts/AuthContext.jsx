import { createContext, useContext, useState, useEffect } from 'react';
import { authenticate, registerUser } from '../services/userService';
import { parseJwt } from '../services/api';

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

  const login = async (email, password) => {
    const { token } = await authenticate({ email, password });
    const payload = parseJwt(token);
    const idClaim =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      payload.nameid ||
      payload.sub;
    const usernameClaim = payload['unique_name'] || payload.name || '';
    const userObj = { token, id: Number(idClaim), username: usernameClaim };
    setUser(userObj);
    return userObj;
  };

  const register = async ({ username, email, password, confirmPassword, firstName, lastName, dateOfBirth }) => {
    await registerUser({ username, email, password, confirmPassword, firstName, lastName, dateOfBirth });
    // après inscription, on peut auto-connecter
    return login(email, password);
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
