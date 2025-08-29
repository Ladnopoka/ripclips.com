"use client";

import Link from "next/link";

export default function ProfilePage() {
  return (
    <div 
      className="min-h-screen text-red-200"
      style={{
        backgroundImage: 'url(/wallpaper_white.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header Section */}
          <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-12 rounded-xl border border-red-900/50 shadow-2xl mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg border border-blue-800">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-red-300 mb-4 drop-shadow-lg">
              👤 User Profile
            </h1>
            
            <div className="text-6xl mb-4">🚧</div>
            
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
              Currently in Development
            </h2>
            
            <p className="text-lg text-red-200/80 max-w-2xl mx-auto leading-relaxed">
              We're working hard to bring you an awesome profile experience! Soon you'll be able to view your submission count, likes received, comments posted, comment likes received, top games, and much more.
            </p>
          </div>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Statistics</h3>
              <p className="text-red-200/70 text-sm">View your submission count, likes received, and engagement metrics</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Top Games</h3>
              <p className="text-red-200/70 text-sm">See which games you've uploaded clips for most frequently</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Comments</h3>
              <p className="text-red-200/70 text-sm">Track comments posted and likes received on your comments</p>
            </div>
          </div>

          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-red-300 hover:text-red-400 transition-colors text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to RIP Clips</span>
          </Link>
        </div>
      </div>
    </div>
  );
}