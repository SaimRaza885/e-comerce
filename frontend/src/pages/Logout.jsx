import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import BackArrow from "../components/BackArrow";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {


    const [loading, setLoading] = useState(false)
    const Navigate = useNavigate()

    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            setLoading(true)
            await api.post("/user/logout", {}, { withCredentials: true }); // call backend logout
            logout() // clear local storage token and cart
            setLoading(false)
            Navigate("/")
        } catch (err) {
            console.error("Logout failed:", err.response?.data || err.message);
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
         <BackArrow/>
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                    Logout
                </h2>


                <button
                    onClick={handleLogout}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                    {loading ? "Logout..." : "Logout"}
                </button>
            </div>
        </div>

    );
}
