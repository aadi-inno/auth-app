"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const ChangePasswordPage = () => {
    const [step, setStep] = useState("email");  // email - verifyOtp - newPassword 3 steps 
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState("");
    const [timer, setTimer] = useState(0);

    const [loading, setLoading] = useState(false);
    const [resentLoad, setResentLoad] = useState(false);

    // NEW PASSWORD STATES
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    const validateEmail = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    useEffect(() => {
        let interval;
        if (step === "verifyOtp" && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer, step]);

    const startTimer = () => setTimer(60);

    // STEP 1 — SEND OTP
    const handleSendOtp = async () => {
        if (!email.trim()) return toast.error("Enter your email",{toastId : "error_enter_email"});
        if (!validateEmail(email)) return toast.error("Enter a valid email",{toastId : "error_enter_valid_email"});

        setLoading(true);
        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/send-change-password-otp",
                { email },
                { withCredentials: true }
            );

            toast.info("OTP sent to your email",{toastId : "info_otp_sent"});

            setUserId(res.data.userId);
            setStep("verifyOtp");
            startTimer();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send OTP",{toastId : "error_otp_sent_fail"});
        } finally {
            setLoading(false);
        }
    };

    // STEP 2 — VERIFY OTP
    const handleVerifyOtp = async () => {
        if (otp.length < 4) return toast.error("Enter valid OTP",{toastId : "error_otp_length"});

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:5000/api/auth/verify-change-password-otp",
                { userId, otp },
                { withCredentials: true }
            );

            toast.success("OTP verified!",{toastId : "otp_verified"});

            setStep("newPassword");
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP",{toastId : "invalid_otp"});
        } finally {
            setLoading(false);
        }
    };

    // STEP 2 — RESEND OTP
    const resendOtp = async () => {
        if (timer > 0) return;

        setResentLoad(true);
        try {
            await axios.post(
                "http://localhost:5000/api/auth/send-change-password-otp",
                { email },
                { withCredentials: true }
            );

            toast.info("OTP resent!",{toastId : "info_otp_resent"});
            setOtp("");
            startTimer();
        } catch (err) {
            toast.error("Could not resend OTP",{toastId  : "error_otp_not_send"});
        } finally {
            setResentLoad(false);
        }
    };

    // STEP 3 — SUBMIT NEW PASSWORD
    const handleNewPasswordSubmit = async () => {
        if (!newPassword || !confirmPassword)
            return toast.error("All fields are required",{toastId : "error_all_field_needed"});

        if (newPassword.length < 6)
            return toast.error("Password must be at least 6 characters",{toastId : "error_password_length"});

        if (newPassword !== confirmPassword)
            return toast.error("Passwords do not match",{toastId : "error_password_mismatch"});

        setLoading(true);
        try {
            await axios.post(
                "http://localhost:5000/api/auth/reset-password",
                { userId, newPassword },
                { withCredentials: true }
            );

            toast.success("Password changed successfully!",{toastId : "passwrod_changed"});

            router.push("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update password",{toastId : "error_password_update_failed"});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-[450px]">

                {/* STEP 1 — EMAIL */}
                {step === "email" && (
                    <>
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
                            Change Password
                        </h2>

                        <p className="text-sm text-gray-500 mb-6 text-center">
                            Enter your email to receive an OTP
                        </p>

                        <input
                            type="email"
                            className="w-full border border-gray-500 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="youremail@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition flex justify-center"
                        >
                            {loading ? <Spinner /> : "Send OTP"}
                        </button>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            Back To Login? {" "}
                            <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                                Login
                            </a>
                        </p>
                    </>
                )}

                {/* STEP 2 — VERIFY OTP */}
                {step === "verifyOtp" && (
                    <>
                        <h2 className="text-3xl font-bold mb-3 text-gray-800 text-center">
                            Verify OTP
                        </h2>

                        <p className="text-sm text-gray-500 mb-3 text-center">
                            OTP sent to <b>{email}</b>
                        </p>

                        <p
                            className={`font-semibold text-center mb-4 ${timer > 0 ? "text-purple-600" : "text-red-500"
                                }`}
                        >
                            {timer > 0
                                ? `⏳ OTP expires in ${timer}s`
                                : "❌ OTP expired. Please resend."}
                        </p>

                        <input
                            type="text"
                            maxLength="6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border border-gray-500 rounded-lg px-4 py-3 text-center text-xl tracking-widest mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Enter OTP"
                        />

                        <button
                            onClick={handleVerifyOtp}
                            disabled={timer === 0 || loading}
                            className={`w-full py-3 rounded-lg text-white font-semibold flex justify-center mb-3 
                                ${timer > 0
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {loading ? <Spinner /> : "Verify OTP"}
                        </button>

                        <button
                            onClick={resendOtp}
                            disabled={timer > 0 || resentLoad}
                            className={`w-full text-purple-600 text-sm font-semibold 
                                ${timer > 0
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:underline"
                                }`}
                        >
                            {resentLoad ? "Sending..." : "Resend OTP"}
                        </button>
                    </>
                )}

                {/* STEP 3 — NEW PASSWORD */}
                {step === "newPassword" && (
                    <>
                        <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
                            Set New Password
                        </h2>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-500 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Enter new password"
                        />

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-500 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                            placeholder="Enter confirm password"
                        />

                        <button
                            onClick={handleNewPasswordSubmit}
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 flex justify-center"
                        >
                            {loading ? <Spinner /> : "Update Password"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordPage;
