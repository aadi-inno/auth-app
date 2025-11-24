"use client"

import React, { useState,useEffect } from 'react'
import Spinner from '@/components/Spinner';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const { setAuthUser } = useAuth();

    const router = useRouter();

    const { authUser, logout ,loadingAuth } = useAuth();

    useEffect(() => {
        if (!loadingAuth && authUser) {
          router.push("/");
        }
      }, [authUser, router]);

    const sendLoginData = async () => {
        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:5000/api/auth/login`, {
                email, password,
            }, {
                withCredentials: true,
            })

            setAuthUser(res.data.user);

            toast.success("Login Successful!",{toastId : "login_done"});
            router.push("/");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Login Failed",{toastId : "login_failed"});
        } finally {
            setLoading(false);
            setEmail("");
            setPassword("");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendLoginData();
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>

            <div className="flex w-full max-w-5xl mx-auto my-auto bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">

                <div className="flex-1 p-12 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Log in</h2>
                        <p className="text-sm text-gray-500 mb-8">Welcome back! Please enter your details</p>

                        <div className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email_input" className="text-sm font-semibold text-gray-700 block mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email_input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password_input" className="text-sm font-semibold text-gray-700 block mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password_input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <button
                                onClick={sendLoginData}
                                disabled={loading}
                                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition-all flex justify-center items-center shadow-lg disabled:opacity-70"
                            >
                                {loading ? <Spinner /> : "Log in"}
                            </button>

                            <div className='flex flex-col gap-2'>
                                <p className="text-center text-sm text-gray-500">
                                    Don't have an account?{" "}
                                    <a href="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
                                        Sign up
                                    </a>
                                </p>
                                <p className="text-center text-sm text-gray-500 ">
                                    Forgot Password?{" "}
                                    <a href="/change-password" className="text-purple-600 hover:text-purple-700 font-semibold">
                                        Chnage your password
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl"></div>

                    <div className="relative h-full flex items-center justify-center p-12">
                        <div className="text-center text-white relative z-10">
                            <div className="w-64 h-64 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <div className="text-7xl">😊</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Welcome</h3>
                            <p className="text-purple-100 text-sm">Track your progess with us</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login