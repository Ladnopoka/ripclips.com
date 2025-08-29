"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { validatePassword } from "@/lib/validation";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SuccessMessage } from "@/components/ui/SuccessMessage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function AuthActionPage() {
  const [mode, setMode] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    setMode(modeParam);
    setActionCode(oobCode);

    if (modeParam === 'resetPassword' && oobCode) {
      // Verify the password reset code and get the email
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          setEmail(email);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error verifying reset code:", error);
          setErrors(["Invalid or expired password reset link. Please request a new one."]);
          setIsLoading(false);
        });
    } else {
      setErrors(["Invalid password reset link."]);
      setIsLoading(false);
    }
  }, [searchParams]);

  const handlePasswordReset = async () => {
    if (!actionCode) {
      setErrors(["Invalid reset code"]);
      return;
    }

    // Reset messages
    setErrors([]);
    setSuccessMessage("");

    // Validate passwords
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setErrors(passwordValidation.errors);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    setIsResetting(true);
    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccessMessage("Password has been reset successfully! You can now login with your new password.");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      const firebaseError = error as { code?: string; message?: string };
      let errorMessage = "Failed to reset password. Please try again.";
      
      switch (firebaseError.code) {
        case 'auth/expired-action-code':
          errorMessage = "This password reset link has expired. Please request a new one.";
          break;
        case 'auth/invalid-action-code':
          errorMessage = "Invalid password reset link. Please request a new one.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = `Error: ${firebaseError.message || 'Unknown error occurred'}`;
      }
      setErrors([errorMessage]);
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center text-red-200"
        style={{
          backgroundImage: 'url(/wallpaper.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="bg-gradient-to-b from-gray-900 to-red-950/70 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-red-900/50">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-red-200">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  if (mode !== 'resetPassword' || !actionCode) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center text-red-200"
        style={{
          backgroundImage: 'url(/wallpaper.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="bg-gradient-to-b from-gray-900 to-red-950/70 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-red-900/50">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-red-400 mb-4">Invalid Link</h1>
          <p className="text-red-200 mb-6">This password reset link is invalid or has expired.</p>
          <button
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all shadow-xl border border-red-800 font-medium"
            onClick={() => router.push("/login")}
          >
            🔙 Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8 text-red-200"
      style={{
        backgroundImage: 'url(/wallpaper.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="bg-gradient-to-b from-gray-900 to-red-950/30 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-red-900/50">
        <div className="text-4xl mb-4">🔐</div>
        <h1 className="text-3xl font-bold text-red-400 mb-2">Reset Password</h1>
        <p className="text-red-200/80 mb-6 text-sm">Resetting password for: <strong>{email}</strong></p>
        
        {successMessage ? (
          <div className="space-y-4">
            <SuccessMessage message={successMessage} />
            <p className="text-sm text-red-200/70">Redirecting to login page...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <input
                className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full shadow-lg"
                type="password"
                placeholder="🔒 New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isResetting}
              />
              <input
                className="border border-red-600 bg-black p-3 rounded-lg text-white focus:border-red-400 focus:ring-red-500 focus:ring-2 w-full shadow-lg"
                type="password"
                placeholder="🔒 Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isResetting}
              />
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg mb-6 text-left">
              <h3 className="text-red-300 font-semibold mb-2 text-sm">Password Requirements:</h3>
              <ul className="text-xs text-red-200/80 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• At least one lowercase letter (a-z)</li>
                <li>• At least one uppercase letter (A-Z)</li>
                <li>• At least one number (0-9)</li>
              </ul>
            </div>

            <button
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg transition-all w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl border border-red-800 font-medium"
              onClick={handlePasswordReset}
              disabled={isResetting || !newPassword || !confirmPassword}
            >
              {isResetting ? <LoadingSpinner size="sm" /> : "🔐 Reset Password"}
            </button>
          </>
        )}

        <ErrorMessage errors={errors} className="mb-4" />

        {!successMessage && (
          <button
            className="text-red-400 hover:text-red-300 hover:underline transition-colors text-sm"
            onClick={() => router.push("/login")}
          >
            🔙 Back to Login
          </button>
        )}
      </div>
    </div>
  );
}