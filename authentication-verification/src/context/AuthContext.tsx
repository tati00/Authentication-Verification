import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check if the token exists when the page is reloaded
  useEffect(() => {
    const token = localStorage.getItem("google_token");
    if (token) {
      const decoded = jwtDecode(token) as User;
      setUser(decoded);
    }
  }, []);

  // Store token and update status
  const login = (token: string) => {
    const decoded = jwtDecode(token) as User;
    setUser(decoded);
    localStorage.setItem("google_token", token);
  };

  // Clean storage and status
  const logout = () => {
    setUser(null);
    localStorage.removeItem("google_token");
  };

  const isAuthenticated = !!user;

  //Provider values
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};