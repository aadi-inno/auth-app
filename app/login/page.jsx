"use client";

import React, { useState, useEffect,useLayoutEffect } from "react";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { authUser, loadingAuth, setAuthUser } = useAuth();
  const router = useRouter();

  useLayoutEffect(() => {
  if (!loadingAuth && authUser) {
    router.replace("/");
  }
}, [authUser, loadingAuth, router]);

  const sendLoginData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      setAuthUser(res.data.user);
      toast.success("Login Successful!", { toastId: "login_done" });
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Login Failed",
        { toastId: "login_failed" }
      );
    } finally {
      setLoading(false);
      setPassword(""); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    sendLoginData();
  };

  const responseGoogle = async (authResult) => {
    try {
      setLoading(true);
      if (authResult?.code) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/google",
          { code: authResult.code },
          { withCredentials: true }
        );

        setAuthUser(res.data.user);
        toast.success("Google Login Successful!");
        router.push("/");
      } else {
        console.error("No auth code in Google response:", authResult);
        toast.error("Google Login Failed");
      }
    } catch (error) {
      console.error("Error requesting google token", error);
      toast.error(
        error.response?.data?.message || "Google Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: (error) => {
      console.error("Google Login Failed:", error);
      toast.error("Google Login Failed");
    },
    flow: "auth-code", // important for backend "postmessage" flow
  });

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="flex w-full max-w-5xl mx-auto my-auto bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* LEFT SIDE - FORM */}
        <div className="flex-1 p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Log in</h2>
            <p className="text-sm text-gray-500 mb-8">
              Welcome back! Please enter your details
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email_input"
                  className="text-sm font-semibold text-gray-700 block mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email_input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password_input"
                  className="text-sm font-semibold text-gray-700 block mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password_input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all flex justify-center items-center shadow-lg disabled:opacity-70"
              >
                {loading ? <Spinner /> : "Log in"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-gray-300" />
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">
                Or continue with
              </span>
              <div className="flex-grow border-t border-gray-300" />
            </div>

            {/* GOOGLE BUTTON */}
            <button
              onClick={() => googleLogin()}
              type="button"
              disabled={loading}
              className="w-full py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all flex justify-center items-center shadow-sm gap-2 disabled:opacity-70"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </button>

            <div className="flex flex-col gap-2 mt-4">
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Sign up
                </a>
              </p>
              <p className="text-center text-sm text-gray-500">
                Forgot Password?{" "}
                <a
                  href="/change-password"
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Change your password
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - ILLUSTRATION */}
        <div className="flex-1 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center text-white relative z-10">
              <div className="w-64 h-64 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="text-7xl">😊</div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Welcome</h3>
              <p className="text-purple-100 text-sm">
                Track your progress with us
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;