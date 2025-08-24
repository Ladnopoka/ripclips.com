"use client";

import { useAuthContext } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function DashboardPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-b from-gray-900 to-red-950/30 rounded-xl shadow-2xl p-8 border border-red-900/50">
          <h1 className="text-4xl font-bold text-red-500 mb-6 drop-shadow-lg">
            💀 Welcome back, {user.displayName}!
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b from-red-950/50 to-black p-6 rounded-lg border border-red-900/50 shadow-xl">
              <h2 className="text-xl font-semibold text-red-300 mb-4">🩸 Your Submissions</h2>
              <p className="text-red-200/70 mb-4">Submit and manage your death clips</p>
              <button 
                onClick={() => router.push("/upload")}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all shadow-lg border border-red-800"
              >
                💀 Submit Death
              </button>
            </div>
            
            <div className="bg-gradient-to-b from-red-950/50 to-black p-6 rounded-lg border border-red-900/50 shadow-xl">
              <h2 className="text-xl font-semibold text-red-300 mb-4">⚔️ Browse Deaths</h2>
              <p className="text-red-200/70 mb-4">Witness epic ARPG carnage</p>
              <button 
                onClick={() => router.push("/clips")}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all shadow-lg border border-red-800"
              >
                🔥 Watch All
              </button>
            </div>
            
            <div className="bg-gradient-to-b from-red-950/50 to-black p-6 rounded-lg border border-red-900/50 shadow-xl">
              <h2 className="text-xl font-semibold text-red-300 mb-4">⚰️ Your Profile</h2>
              <p className="text-red-200/70 mb-4">View your death statistics</p>
              <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all shadow-lg border border-red-800">
                🩸 View Profile
              </button>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-b from-red-950/50 to-black p-6 rounded-lg border border-red-900/50 shadow-xl">
            <h2 className="text-xl font-semibold text-red-300 mb-4">🔥 Recent Carnage</h2>
            <p className="text-red-200/70">Your recent death submissions and activity will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}