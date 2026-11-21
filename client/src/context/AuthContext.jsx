import { createContext, useContext, useState } from 'react';

const USER_KEY = 'alzikrayat_user';
const AuthContext = createContext(null);

/** Holds the logged-in user in React state, mirrored to localStorage. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  });

  const login = (profile) => {
    setUser(profile);
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
