"use client";

import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: fullName,
      });

      setMessage(
        `Welcome, ${userCredential.user.displayName}! Signed up as: ${userCredential.user.email}`
      );

      router.push("/homepage");
    } catch (error: any) {
      setMessage(`${error.code}: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 px-4">
      <div className="bg-slate-800 p-8 rounded-xl shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-green-500 mb-6">
          Register
        </h1>
        <p className="text-green-200 mb-8">
          Create your account below
        </p>
        <input
          className="border border-green-400 bg-slate-900 p-2 rounded text-white focus:border-green-600 focus:ring-green-200 focus:ring-2 w-full mb-4"
          type="text"
          placeholder="Enter full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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
          onClick={handleRegister}
        >
          Register
        </button>
        {message && <p className="mt-2 text-green-200">{message}</p>}
        <button
          className="mt-6 text-green-400 hover:underline"
          onClick={() => router.push("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
