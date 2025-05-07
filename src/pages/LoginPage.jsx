import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiCopy } from "react-icons/fi";
import api from "../services/api";
import Cookies from "js-cookie";
import useUserStore from "../context/userStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data: { token } } = await api.post("/auth/login", {
        user_email: email,
        user_password: password,
      });

      Cookies.set("token", token, { expires: rememberMe ? 7 : 1 });

      const { data: userInfo } = await api.get("/user/getuserinfo", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(userInfo);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (label, type, value, onChange, placeholder, icon, toggleIcon) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 block">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={toggleIcon ? (showPassword ? "text" : "password") : type}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={type}
          required
        />
        {toggleIcon && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 p-3 rounded-full cursor-pointer">
                <FiUser className="text-white text-2xl" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-sm text-teal-100 mt-1">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            <form onSubmit={handleLogin} className="space-y-5">
              {renderInputField("Email", "email", email, (e) => setEmail(e.target.value), "Enter your email", <FiMail />)}
              {renderInputField("Password", "password", password, (e) => setPassword(e.target.value), "Enter your password", <FiLock />, true)}

              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className={`w-full flex justify-center items-center py-3 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z" />
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center">
              <Link to="/reset-password" className="text-sm text-teal-600 hover:text-teal-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
