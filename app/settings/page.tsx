"use client";

import Link from "next/link";

export default function SettingsPage() {
  return (
    <div 
      className="min-h-screen text-red-200"
      style={{
        backgroundImage: 'url(/large_wallpaper.jpeg)',
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
            <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-teal-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg border border-green-800">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl font-bold text-red-300 mb-4 drop-shadow-lg">
              ⚙️ Settings
            </h1>
            
            <div className="text-6xl mb-4">🚧</div>
            
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
              Currently in Development
            </h2>
            
            <p className="text-lg text-red-200/80 max-w-2xl mx-auto leading-relaxed">
              We're building a comprehensive settings page where you'll be able to customize your experience, change layouts, backgrounds, and much more. Stay tuned!
            </p>
          </div>

          {/* Coming Soon Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Themes</h3>
              <p className="text-red-200/70 text-sm">Customize your experience with different themes and backgrounds</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Layout</h3>
              <p className="text-red-200/70 text-sm">Choose between different layout options and display preferences</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">🔔</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Notifications</h3>
              <p className="text-red-200/70 text-sm">Control how and when you receive notifications about activity</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Privacy</h3>
              <p className="text-red-200/70 text-sm">Manage your privacy settings and data preferences</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Game Preferences</h3>
              <p className="text-red-200/70 text-sm">Set your favorite games and customize game-specific settings</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl border border-red-900/50 shadow-2xl">
              <div className="text-3xl mb-3">👤</div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Account</h3>
              <p className="text-red-200/70 text-sm">Update your account information and security settings</p>
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