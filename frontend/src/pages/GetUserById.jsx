import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Shield, Calendar, Edit3, Lock, LayoutDashboard, RefreshCw, UserCircle } from "lucide-react";
import api from "../api/axios";
import UpdateFullName from "./Update_FullName";
import { Button, Spinner } from "../components/ui";
import AccountSidebar from "../components/AccountSidebar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/user/me");
        setUser(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <RefreshCw className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <UserCircle className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Not logged in.</p>
        <Link to="/login"><Button variant="primary">Login</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <AccountSidebar />

          {/* Main */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Avatar Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary px-6 py-10">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/50 mx-auto">
              <span className="text-3xl font-bold text-white">{user.fullName.charAt(0).toUpperCase()}</span>
            </div>
          </div>

          <div className="p-6">
            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
              {user.urdu_name && (
                <p className="text-sm text-gray-500">{user.urdu_name}</p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-secondary" />
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-4 h-4 text-secondary" />
                <span className="text-sm text-gray-600 capitalize">Role: {user.role}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-secondary" />
                <span className="text-sm text-gray-600">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setModalOpen(true)}
                icon={<Edit3 className="w-4 h-4" />}
              >
                Change Name
              </Button>
              <UpdateFullName
                id={user._id}
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
              />
              <Link to="/account/change-password" className="flex-1">
                <Button variant="outline" className="w-full" icon={<Lock className="w-4 h-4" />}>
                  Change Password
                </Button>
              </Link>
              <Link to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="flex-1">
                <Button variant="primary" className="w-full" icon={<LayoutDashboard className="w-4 h-4" />}>
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
