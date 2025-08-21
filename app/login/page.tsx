"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage(`Welcome back, ${userCredential.user.email}`);
      console.log("Logged in user:", userCredential.user);
    } catch (error: any) {
      console.error(error);
      setMessage(`${error.code}: ${error.message}`);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4 bg-green-50 min-h-screen">
      <main className="flex flex-col items-center p-12 bg-green-100 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold text-green-700">Login</h1>
        <p className="mt-4 text-green-800">Enter your details to log in</p>
      </main>

      <input
        className="border border-green-400 p-2 rounded text-black focus:border-green-600 focus:ring-green-200 focus:ring-2 w-full max-w-md mt-6"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border border-green-400 p-2 rounded text-black focus:border-green-600 focus:ring-green-200 focus:ring-2 w-full max-w-md"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors w-full max-w-md"
        onClick={handleLogin}
      >
        Login
      </button>

      {message && <p className="mt-4 text-green-800">{message}</p>}
    </div>
  );
}