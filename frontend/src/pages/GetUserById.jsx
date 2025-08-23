import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiUser, FiCheckCircle, FiLock, FiEdit } from "react-icons/fi";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Not logged in. Please <Link to="/login" className="text-blue-500 underline">login</Link> to continue.
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-48 flex items-center justify-center relative rounded-b-3xl shadow-lg">
          <div className="absolute -bottom-16">
            <div className="w-32 h-32 bg-white text-blue-600 rounded-full flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-white">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="max-w-4xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-gray-800">{user.fullName}</h1>
                <p className="text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <FiUser /> Role: {user.role}
                </p>
                <p className="text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <FiMail /> Email: {user.email}
                </p>
                <p className="text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
                  <FiCheckCircle className="text-green-500" /> Status: Active
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-4 sm:mt-0">
                <Link to="/account/edit">
                  <button className="flex items-center gap-2 justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow transition">
                    <FiEdit /> Edit Profile
                  </button>
                </Link>
                <Link to="/account/change-password">
                  <button className="flex items-center gap-2 justify-center px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow transition">
                    <FiLock /> Change Password
                  </button>
                </Link>
                <Link to="/logout">
                  <button className="flex items-center gap-2 justify-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow transition">
                    <FiCheckCircle /> Logout
                  </button>
                </Link>
              </div>
            </div>

            {/* Extra Info Section */}
            <div className="mt-10 grid grid-cols-1 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl flex flex-col items-center justify-center">
                <p className="text-gray-500 text-sm">Joined On</p>
                <p className="font-semibold text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
