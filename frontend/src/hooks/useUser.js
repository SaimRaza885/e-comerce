// src/hooks/useUser.js
import { useEffect, useState } from "react";
import api from "../api/axios";

const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/user/${userId}`);
        setUser(data.data); // ✅ ApiResponse wraps user in data
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  return { user, loading, error };
};

export default useUser;
