import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Save token and notify Header
      localStorage.setItem("adminToken", data.token);
      window.dispatchEvent(new Event("authChanged"));

      toast.success("Welcome to Dashboard!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-lg placeholder-gray-400 transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white p-3 rounded-lg placeholder-gray-400 transition"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-lg shadow-md"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400 text-sm">
          Designed for{" "}
          <span className="text-blue-400 font-medium">Car Management</span> Admins
        </div>
      </div>
    </div>
  );
}