"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/AuthContext";
import { useAuth } from "@/lib/useAuth";

export default function Homepage() {
  const { user } = useAuthContext();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
        <div className="bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-green-500 mb-6">
            Hey, {user.displayName}! You&apos;re successfully logged in!
          </h1>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-500 mb-6">
          Welcome to Babylon Assessment Test!
        </h1>
        <p className="text-green-200 mb-8">
          Access your account or register a new one
        </p>
        <div className="flex flex-col gap-4">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            onClick={() => router.push("/register")}
          >
            Register
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
