import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui";
import Logo from "../components/Logo";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post("/user/logout", {}, { withCredentials: true });
      logout();
      navigate("/");
    } catch {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-6">
          <Logo scrolled={true} />
        </div>
        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-primary mb-2">Leave so soon?</h2>
          <p className="text-secondary text-sm mb-6">You'll need to sign in again to access your account.</p>
          <Button
            onClick={handleLogout}
            loading={loading}
            variant="danger"
            size="lg"
            className="w-full"
            icon={<LogOut className="w-4 h-4" />}
          >
            {loading ? "Signing out..." : "Yes, Log Me Out"}
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm text-gray-400 hover:text-primary font-bold transition-colors"
          >
            Never mind, go back
          </button>
        </div>
      </div>
    </div>
  );
}
