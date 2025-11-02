import { useEffect, useState } from "react";
import api from "../api/axios"; // axios instance
import { useNavigate, Link, data } from "react-router-dom";
import Logo from "../components/Logo";
import BackArrow from "../components/BackArrow";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const [statusCode, setStatusCode] = useState(null);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/user/login", form, {
        withCredentials: true, // send cookies
      });

      const token = res.data.data.accessToken;
      const loginDate = new Date();
      login(res.data.data.user, token, loginDate);
      setMessage(res.data.message || "Login successful!");
      setStatusCode(res.data.statusCode)

      // Redirect after login
      navigate("/account/profile");
    } catch (err) {
      setMessage(err.message);
      setStatusCode(err.statusCode || 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <BackArrow />
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login
        </h2>

        {message && (
          <div className={`mb-4 text-sm text-center ${statusCode > 205 ? "text-red-600" : "text-green-600"} `}>{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-10 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>


          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div >
  );
}
