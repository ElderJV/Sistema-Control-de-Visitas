import { createContext, useState, useEffect } from "react";
import authService from "../api/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    authService.getMe().then(setUser).catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
