import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import api from "../api/axios";
import { Button, Input } from "../components/ui";
import Logo from "../components/Logo";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", role: "user", adminSecret: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/logout");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      await api.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo scrolled={true} />
          </div>
          <h1 className="text-3xl font-black text-primary">Create Account</h1>
          <p className="text-secondary mt-1">Join our dry fruits family</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
            />

            <div>
              <label className="block text-sm font-bold text-primary mb-1.5 tracking-wide uppercase">
                Account Type
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              >
                <option value="user">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {form.role === "admin" && (
              <Input
                label="Admin Secret"
                type="password"
                name="adminSecret"
                value={form.adminSecret}
                onChange={handleChange}
                placeholder="Enter admin secret code"
              />
            )}

            <Button
              type="submit"
              loading={loading}
              icon={<UserPlus className="w-4 h-4" />}
              className="w-full"
              size="lg"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-accent font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
