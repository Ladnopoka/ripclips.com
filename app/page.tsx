"use client";

import Image from "next/image";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setMessage(`Signed up as: ${userCredential.user.email}`);
      console.log("User:", userCredential.user); // testing here if user details to console
    } catch (error: any) {
      console.error(error);
      setMessage(`${error.code}: ${error.message}`);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Test Signup</h1>

      <input
        className="border p-2 rounded text-black"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 rounded text-black"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleRegister}
      >
        Register
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
