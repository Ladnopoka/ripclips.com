"use client";

import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword,
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
    <div className="p-8 flex flex-col items-center gap-4 bg-green-50 min-h-screen">
      <main className="flex min-h-[100px] flex-col items-center justify-between p-12 bg-green-100 rounded-lg shadow-md w-full max-w-xl">
        <h1 className="text-4xl font-bold text-green-700">
          Babylon Assessment Task
        </h1>
        <p className="mt-4 text-green-800">
          This is a simple authentication setup using Firebase
        </p>
      </main>

      <h1 className="text-2xl font-bold text-green-700 mt-8">Test Signup</h1>

      <input
        className="border border-green-400 p-2 rounded text-black focus:border-green-600 focus:ring-green-200 focus:ring-2 w-full max-w-md"
        type="text"
        placeholder="Enter full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        className="border border-green-400 p-2 rounded text-black focus:border-green-600 focus:ring-green-200 focus:ring-2 w-full max-w-md"
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
        onClick={handleRegister}
      >
        Register
      </button>

      {message && <p className="mt-4 text-green-800">{message}</p>}
    </div>
  );
}
