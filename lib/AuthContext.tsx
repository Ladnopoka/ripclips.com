"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If user exists but displayName is null, reload the user to get updated profile
      if (user && !user.displayName) {
        try {
          await user.reload();
          // Get the refreshed user from auth.currentUser
          setUser(auth.currentUser);
        } catch (error) {
          console.error("Error reloading user:", error);
          setUser(user);
        }
      } else {
        setUser(user);
      }
      setLoading(false);
      
      // Set/remove auth cookie for middleware
      if (user) {
        // Get the ID token and set it as a cookie
        const token = await user.getIdToken();
        document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
      } else {
        // Remove auth cookie
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};