"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utensils, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;

      if (isLogin) {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await authAPI.signup(formData);
      }

      const data = response.data;

      // ✅ Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      // 🔥 FIXED REDIRECT LOGIC
      if (data.has_store) {
        router.push("/admin");
      } else {
        router.push("/create-store");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;

      let message = "Something went wrong";

      if (Array.isArray(detail)) {
        message = detail[0]?.msg; // 🔥 MOST IMPORTANT FIX
      } else if (typeof detail === "string") {
        message = detail;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Utensils className="w-8 h-8 text-orange-500" />
          <span className="text-2xl font-bold">QR Scan & Order</span>
        </div>

        <div className="bg-white p-8 rounded-xl shadow border">
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? "Login" : "Create Account"}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Signup only */}
            {!isLogin && (
              <>
                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </>
            )}

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />

            {/* Password with toggle */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              className="w-full bg-orange-500 text-white py-2 rounded"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-orange-500 text-sm"
          >
            {isLogin ? "Create new account" : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
}
