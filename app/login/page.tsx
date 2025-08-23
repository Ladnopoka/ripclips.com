"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { validateLoginForm } from "@/lib/validation";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SuccessMessage } from "@/components/ui/SuccessMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // Reset messages
    setErrors([]);
    setSuccessMessage("");

    // Validate form
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      setSuccessMessage(`Welcome back, ${user.email}!`);
      setTimeout(() => router.push("/homepage"), 1500);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = firebaseError.code === 'auth/user-not-found' 
        ? "No account found with this email address"
        : firebaseError.code === 'auth/wrong-password'
        ? "Incorrect password"
        : firebaseError.code === 'auth/invalid-credential'
        ? "Invalid email or password"
        : "Login failed. Please try again.";
      setErrors([errorMessage]);
    } finally {
      setIsLoading(false);
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
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : "Login"}
        </button>
        
        <ErrorMessage errors={errors} className="mb-4" />
        <SuccessMessage message={successMessage} className="mb-4" />
        <button
          className="mt-6 text-green-400 hover:underline"
          onClick={() => router.push("/register")}
        >
          Don&apos;t have an account? Register
        </button>
      </div>
    </div>
  );
}