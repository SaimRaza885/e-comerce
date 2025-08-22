import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);



  

  // ✅ Login helper (optional, since Login.js already does it)


  // ✅ Logout


  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
