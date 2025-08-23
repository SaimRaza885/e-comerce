import { createContext, useContext, useState, useEffect } from "react";

import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);



  // fetch profile from backend using token in localStorage
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        setUser(res.data.data); // backend should return user data here
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
