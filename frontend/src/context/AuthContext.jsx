import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  // ✅ Fetch profile from backend if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return;

      try {
        const res = await api.get("/user/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUser(res.data.data); // backend should return user object
        // console.log(res.data.data)
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        logout(); // if token invalid, clear it
      }
    };

    fetchProfile();
  }, [accessToken]);

  // ✅ Login: store user & token
  const login = (userData, token, loginDate) => {
    localStorage.setItem("accessToken", token);
    setAccessToken(token);
    setUser(userData);

    // Calculate 30 days later
    const future = new Date(loginDate);
    future.setDate(loginDate.getDate() + 30);

    // Create readable message
    const message = `You logged in on ${loginDate.toLocaleString()}. After 30 days, login again on ${future.toLocaleString()}.`;
    localStorage.setItem("date_login", message);
  };
  // ✅ Logout: clear user & token
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("cart")
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
