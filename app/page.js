"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { authUser, logout, loadingAuth } = useAuth();

  useEffect(() => {
    if (!loadingAuth && !authUser) {
      router.push("/login");
    }
  }, [authUser, loadingAuth, router]);

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!authUser) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">

      <h1 className="text-3xl font-bold mb-4">
        Welcome, {authUser.fullName}! 👋
      </h1>

      <p className="text-gray-600 mb-8">
        Logged in as: <span className="font-semibold">{authUser.email}</span>
      </p>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition"
      >
        Logout
      </button>

    </div>
  );
}
