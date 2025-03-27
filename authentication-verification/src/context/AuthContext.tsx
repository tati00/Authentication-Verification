import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { startKYC, getKYCStatus } from "../services/diditAPI.ts";

interface User {
  email: string;
  name: string;
  kycStatus?: "pending" | "approved" | "rejected" | "not_started";
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  startKYC: () => Promise<void>;
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

  // Init KYC with Didit.me
  const startKYCProcess = async () => {
    if (!user) throw new Error("Non-authenticated user");

    try {
      const kycResponse = await startKYC(user.email, user.name);

      setUser((prevUser) => ({
        ...prevUser!,
        kycStatus: "pending",
        sessionId: kycResponse.session_id,
      }));

      localStorage.setItem(
        "user_data",
        JSON.stringify({ ...user, kycStatus: "pending", sessionId: kycResponse.session_id })
      );

      pollKYCStatus(kycResponse.session_id);
    } catch (error) {
      console.error("Error en KYC:", error);
    }
  };

  const pollKYCStatus = async (sessionId: string) => {
    const interval = setInterval(async () => {
      if (!user) return;

      try {
        const statusResponse = await getKYCStatus(sessionId);
        const newStatus = statusResponse.status;

        if (newStatus !== "pending") {
          clearInterval(interval);
          setUser((prevUser) => ({ ...prevUser!, kycStatus: newStatus }));
          localStorage.setItem(
            "user_data",
            JSON.stringify({ ...user, kycStatus: newStatus })
          );
        }
      } catch (error) {
        console.error("Error en polling KYC:", error);
      }
    }, 5000);
  };

  //Provider values
  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, startKYC: startKYCProcess }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
