"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import Spinner from '@/components/Spinner';
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [step, setStep] = useState("signup");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState("");

    const [timer, setTimer] = useState(0);

    const [loading, setLoading] = useState(false);
    const [resentLoad, setResetLoad] = useState(false);

    const { setAuthUser } = useAuth();
    const router = useRouter();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        let interval;

        if (step === "verifyOtp" && timer > 0) {
            interval = setTimeout(() => {
                setTimer((prev) => prev - 1)
            }, 1000)
        }

        return () => clearTimeout(interval);

    }, [timer, step])

    const startTimer = () => setTimer(60);


    const submitSignup = async () => {
        if (!fullName.trim()) return toast.error("Please enter your full name",{toastId : "error_enter_full_name"});
        if (!email.trim()) return toast.error("Please enter your email",{toastId : "error_enter_email"});
        if (!validateEmail(email)) return toast.error("Please enter a valid email",{toastId : "error_valid_email"});
        if (!password) return toast.error("Please enter a password",{toastId : "error_enter_password"});
        if (password.length < 6) return toast.error("Password must be at least 6 characters",{toastId : "error_length_password"});

        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                { fullName, email, password },
                { withCredentials: true }
            );

            toast.info("OTP sent to your email!",{toastId : "info_otp_sent"});

            setUserId(res.data.temporaryUserId);
            setStep("verifyOtp");
            startTimer();
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed",{toastId : "error_signup_failed"});
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpHandler = async () => {
        if (otp.length < 4) return toast.error("Enter valid OTP" , {toastId : "error_enter_valid_otp"});

        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/verify-otp",
                { userId, otp },
                { withCredentials: true }
            );

            setAuthUser(res.data.user);
            toast.success("Account verified successfully!",{toastId : "account_verified"});

            router.push("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP",{toastId : "error_invalid_otp"});
        } finally {
            setLoading(false);
        }
    };


    const resendOtp = async () => {
        try {
            setResetLoad(true);
            await axios.post(
                "http://localhost:5000/api/auth/register",
                { fullName, email, password },
                { withCredentials: true }
            );

            toast.info("OTP resent to your email",{toastId : "info_otp_send"});

            setOtp("");
            startTimer();
        } catch (err) {
            toast.error("Could not resend OTP",{toastId : "error_failed_resend_otp"});
        } finally {
            setResetLoad(false);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-white relative overflow-hidden">

            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full opacity-20 translate-x-1/3 translate-y-1/3 blur-3xl"></div>


            <div className="flex w-full max-w-5xl mx-auto my-auto bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10">

                {/* LEFT SIDE UI  */}
                <div className="flex-1 p-12 flex flex-col justify-center">
                    <div className="max-w-sm mx-auto w-full">

                        {step === "signup" && (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h2>
                                <p className="text-sm text-gray-500 mb-8">Start your journey today</p>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full border border-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Email</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="youremail@gmail.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border border-gray-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Enter your password"
                                        />
                                    </div>

                                    <button
                                        onClick={submitSignup}
                                        disabled={loading}
                                        className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold hover:from-purple-700 hover:to-purple-600 transition flex justify-center items-center shadow-lg disabled:opacity-70 mt-6"
                                    >
                                        {loading ? <Spinner /> : "Register"}
                                    </button>

                                    <p className="text-center text-sm text-gray-500 mt-6">
                                        Already have an account?{" "}
                                        <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                                            Login
                                        </a>
                                    </p>
                                </div>
                            </>
                        )}

                        {step === "verifyOtp" && (
                            <>
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
                                <p className="text-sm text-gray-500 mb-8">
                                    A 6-digit OTP has been sent to <b>{email}</b>.
                                </p>


                                <p className={`font-semibold text-sm mb-4 
                                                ${timer > 0 ? "text-purple-600" : "text-red-500"}
                                `}>
                                    {timer > 0
                                        ? `⏳ OTP expires in ${timer}s`
                                        : "❌ OTP expired. Please resend."
                                    }
                                </p>

                                <input
                                    type="text"
                                    maxLength="6"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border border-gray-500 rounded-lg px-4 py-3 text-center tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Enter OTP"
                                />

                                <button
                                    onClick={verifyOtpHandler}
                                    disabled={timer === 0 || loading}
                                    className="w-full py-3 mt-5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition flex justify-center items-center shadow-lg disabled:bg-purple-300 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Spinner /> : "Verify OTP"}
                                </button>

                                <button
                                    onClick={resendOtp}
                                    disabled={timer > 0 || resentLoad}
                                    className="mt-4 w-full text-purple-600 text-sm font-semibold hover:underline disabled:cursor-not-allowed"
                                >
                                    {resentLoad ? "Sending..." : "Reset OTP"}
                                </button>
                            </>
                        )}

                    </div>
                </div>

                {/* RIGHT SECTION UI */}
                <div className="flex-1 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl"></div>

                    <div className="relative h-full flex items-center justify-center p-12">
                        <div className="text-center text-white relative z-10">
                            <div className="w-64 h-64 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <div className="text-7xl">😁</div>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Begin Your Journey</h3>
                            <p className="text-purple-100 text-sm">Join thousands achieving their goals</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Signup;
