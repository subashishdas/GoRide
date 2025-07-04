import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempted with:", { email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#0D47A1] mb-2">GoRide</h1>
          <p className="text-gray-600">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/20 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#0D47A1] focus:ring-2 focus:ring-[#0D47A1]/20 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-[#0D47A1] hover:text-blue-800 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#0D47A1] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/register"
                className="text-[#0D47A1] hover:text-blue-800 font-medium transition-colors"
              >
                Create Account
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Captain Login */}
          <button className="w-full bg-gradient-to-r from-[#0D47A1] to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-800 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2">
            <span>🚗</span>
            Sign in as Captain
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <Link to="/terms" className="text-[#0D47A1] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[#0D47A1] hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
