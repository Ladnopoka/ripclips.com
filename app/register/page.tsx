"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { validateRegistrationForm } from "@/lib/validation";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SuccessMessage } from "@/components/ui/SuccessMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    // Reset messages
    setErrors([]);
    setSuccessMessage("");

    // Validate form
    const validation = validateRegistrationForm(email, password, fullName);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await register(email, password, fullName);
      setSuccessMessage(`Welcome, ${user.displayName}! Registration successful.`);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = firebaseError.code === 'auth/email-already-in-use'
        ? "An account with this email already exists"
        : firebaseError.code === 'auth/weak-password'
        ? "Password is too weak"
        : "Registration failed. Please try again.";
      setErrors([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8">
      <div className="bg-gradient-to-b from-gray-900 to-red-950/30 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-red-900/50">
        <h1 className="text-4xl font-bold text-red-500 mb-6 drop-shadow-lg">
          💀 Join the Arena
        </h1>
        <p className="text-red-200 mb-8">
          🩸 Create your death-seeker account
        </p>
        <input
          className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full mb-4 shadow-lg"
          type="text"
          placeholder="⚰️ Your warrior name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full mb-4 shadow-lg"
          type="email"
          placeholder="💀 Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full mb-6 shadow-lg"
          type="password"
          placeholder="🗡️ Create password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl border border-red-800 font-medium"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : "🩸 Enter the Arena"}
        </button>
        
        <ErrorMessage errors={errors} className="mb-4" />
        <SuccessMessage message={successMessage} className="mb-4" />
        <button
          className="mt-6 text-red-400 hover:text-red-300 hover:underline transition-colors"
          onClick={() => router.push("/login")}
        >
          ⚔️ Already a death seeker? Enter here
        </button>
      </div>
    </div>
  );
}
