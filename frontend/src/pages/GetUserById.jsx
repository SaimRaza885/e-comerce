import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function ProfileCard() {

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



  if (!user) {
    return (
      <p className="text-red-500 text-center mt-10">
        Not logged in. Please login to continue.
      </p>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg rounded-xl max-w-md mx-auto mt-10 text-white">
      <div className="flex items-center space-x-4">
        {/* Avatar Circle with initials */}
        {/* <img src={user?.avatar} alt="tjs" width={100} height={100} /> */}
        <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow">
          {user?.fullName?.charAt(0).toUpperCase() || "U"}
        </div>

        <div>
          <h2 className="text-2xl font-bold">{user?.fullName || user.fullName}</h2>
          <p className="text-blue-100">Role: {user?.role || user.role}</p>
        </div>
      </div>

      {/* Extra dashboard-like info */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="bg-white/20 p-3 rounded-lg">
          <p className="text-sm text-blue-100">Email</p>
          <p className="font-semibold">{user?.email || user.email}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <p className="text-sm text-blue-100">Status</p>
          <p className="font-semibold">Active ✅</p>
        </div>
      </div>

      {/* Logout button */}
      <Link to={"/logout"}>
        <button
          // onClick={logout}
          className="mt-6 w-full py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
        >
          Logout
        </button>
      </Link>
    </div>
  );
}
