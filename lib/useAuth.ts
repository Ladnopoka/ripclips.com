"use client";

import { useState, useEffect } from "react";
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
      });
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const register = async (email: string, password: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });
    // Reload the user to get the updated profile
    await userCredential.user.reload();
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/auth/action?mode=resetPassword`,
      handleCodeInApp: false,
    };
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  return {
    user: authState.user,
    loading: authState.loading,
    login,
    register,
    logout,
    resetPassword,
  };
};