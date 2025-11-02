import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiUser, FiCheckCircle, FiLock, FiEdit } from "react-icons/fi";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import UpdateFullName from "./Update_FullName";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      } finally {
        setLoading(false); // ✅ Now only runs after fetch completes
      }
    };

    fetchProfile();
  }, [isModalOpen]);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {loading ? (
          <p className="text-gray-500 text-xl">Loading...</p>
        ) : (
          <p className="text-red-500 text-lg">
            Not logged in. Please{" "}
            <Link to="/login" className="text-blue-500 underline">
              login
            </Link>{" "}
            to continue.
          </p>
        )}
      </div>
    );
  }



  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        {/* Header Section */}
        
        <div className="profile_gradient">
          <div className="absolute -bottom-16">
            <div className="profile_avatar">
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
                <p className="profile_mini_info">
                  <FiUser /> Role: {user.role}
                </p>
                <p className="profile_mini_info">
                  <FiMail /> Email: {user.email}
                </p>
                <p className="profile_mini_info">
                  <FiCheckCircle className="text-green-500" /> Status: Active
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mt-4 sm:mt-0">

                <button onClick={() => setModalOpen(true)} className="profile_btn profile_btn_blue">
                  <FiEdit /> Change Name
                </button>
                <UpdateFullName
                  id={user._id} // Replace with real user ID
                  isOpen={isModalOpen}
                  onClose={() => setModalOpen(false)}
                />
                <Link to="/account/change-password">
                  <button className="profile_btn profile_btn-yellow">
                    <FiLock /> Change Password
                  </button>
                </Link>
                <Link to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}>
                  <button className="profile_btn profile_btn-red">
                    <FiUser /> Dashboard
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
