"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); 

  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
      setAuthUser(JSON.parse(savedUser));
    }
    setLoadingAuth(false); 
  }, []);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [authUser]);

  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      });

      toast.success("Logged out!");
      setAuthUser(null);

    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
