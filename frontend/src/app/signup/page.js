

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utensils, Eye, EyeOff } from "lucide-react";
import { authAPI } from "@/lib/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      if (data.has_store) {
        router.push("/admin");
      } else {
        router.push("/create-store");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;

      let message = "Something went wrong";

      if (Array.isArray(detail)) {
        message = detail[0]?.msg;
      } else if (typeof detail === "string") {
        message = detail;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-orange-50 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2">
            <Utensils className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-900">
              QR Scan & Order
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Smart restaurant ordering system
          </p>
        </div>

        {/* CARD */}
        <Card className="rounded-2xl shadow-lg bg-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl md:text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin
                ? "Login to manage your store"
                : "Start your digital restaurant"}
            </p>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm bg-red-100 text-red-600 rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* SIGNUP FIELDS */}
              {!isLogin && (
                <>
                  <Input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    required
                  />

                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {/* EMAIL */}
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                onChange={handleChange}
                required
              />

              {/* PASSWORD */}
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={handleChange}
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium hover:scale-[1.02] transition"
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </Button>

            </form>

            {/* TOGGLE */}
            <div className="text-center mt-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-orange-500 hover:underline"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Login"}
              </button>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}