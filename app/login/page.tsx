"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/homepage"); // redirect logged-in users
      }
    });

    return () => unsubscribe();
  }, [router]); 

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage(`Welcome back, ${userCredential.user.email}`);
      router.push("/homepage");
    } catch (error: any) {
      setMessage(`${error.code}: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-500 mb-6">Login</h1>
        <p className="text-green-200 mb-8">Enter your details to log in</p>
        <input
          className="border border-green-400 bg-slate-900 p-2 rounded text-white focus:border-green-600 focus:ring-green-200 focus:ring-2 w-full mb-4"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-green-400 bg-slate-900 p-2 rounded text-white focus:border-green-600 focus:ring-green-200 focus:ring-2 w-full mb-6"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition w-full mb-4"
          onClick={handleLogin}
        >
          Login
        </button>
        {message && <p className="mt-2 text-green-200">{message}</p>}
        <button
          className="mt-6 text-green-400 hover:underline"
          onClick={() => router.push("/register")}
        >
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
}