import { useState } from "react";
import api from "../api/axios"; // your axios instance
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // ✅ lowercase

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {

      if (localStorage.getItem("accessToken")) {
        alert("please Logout First")
        navigate("/logout")
      }
      const res = await api.post("/user/login", form, {
        withCredentials: true,
      });

      // ✅ Save token in localStorage
      localStorage.setItem("accessToken", res.data.data.accessToken);

      setMessage(res.data.message || "Login successful!");

      // redirect to profile
      navigate("/profile");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Login
        </h2>

        {message && (
          <div className="mb-4 text-sm text-center text-red-600">{message}</div>
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
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
