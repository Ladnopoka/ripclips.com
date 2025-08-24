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
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  const { login, resetPassword } = useAuth();
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
      setTimeout(() => router.push("/dashboard"), 1500);
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

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      setErrors(["Please enter your email address"]);
      return;
    }

    setIsResetting(true);
    setErrors([]);
    setSuccessMessage("");

    try {
      await resetPassword(resetEmail);
      setSuccessMessage("Password reset email sent! Check your inbox.");
      setShowResetForm(false);
      setResetEmail("");
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      const errorMessage = firebaseError.code === 'auth/user-not-found'
        ? "No account found with this email address"
        : "Failed to send reset email. Please try again.";
      setErrors([errorMessage]);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-black via-red-950/20 to-black">
      <div className="bg-gradient-to-b from-gray-900 to-red-950/30 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-red-900/50">
        <h1 className="text-4xl font-bold text-red-500 mb-6 drop-shadow-lg">💀 Login</h1>
        <p className="text-red-200 mb-8">Enter the death arena</p>
        
        {!showResetForm ? (
          <>
            <input
              className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full mb-4 shadow-lg"
              type="email"
              placeholder="💀 Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full mb-4 shadow-lg"
              type="password"
              placeholder="🗡️ Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl border border-red-800 font-medium"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "⚔️ Enter Arena"}
            </button>
            
            <button
              className="text-red-400 hover:text-red-300 hover:underline transition-colors text-sm mb-4"
              onClick={() => setShowResetForm(true)}
            >
              🔑 Forgot your password?
            </button>
          </>
        ) : (
          <>
            <p className="text-red-200 mb-4 text-sm">Enter your email to receive a password reset link</p>
            <input
              className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full mb-4 shadow-lg"
              type="email"
              placeholder="💀 Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl border border-red-800 font-medium"
              onClick={handlePasswordReset}
              disabled={isResetting}
            >
              {isResetting ? <LoadingSpinner size="sm" /> : "Send Email to reset password"}
            </button>
            
            <button
              className="text-red-400 hover:text-red-300 hover:underline transition-colors text-sm mb-4"
              onClick={() => {
                setShowResetForm(false);
                setResetEmail("");
                setErrors([]);
                setSuccessMessage("");
              }}
            >
              ← Back to login
            </button>
          </>
        )}
        
        <ErrorMessage errors={errors} className="mb-4" />
        <SuccessMessage message={successMessage} className="mb-4" />
        
        <button
          className="mt-6 text-red-400 hover:text-red-300 hover:underline transition-colors"
          onClick={() => router.push("/register")}
        >
          💀 New to the carnage? Join us
        </button>
      </div>
    </div>
  );
}