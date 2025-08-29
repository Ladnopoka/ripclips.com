"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/wallpaper_dungeon.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            ARPG Hardcore
            <span className="text-red-500 drop-shadow-lg"> HUB</span>
          </h1>
          <p className="text-xl text-red-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Welcome to the Hardcore RIP Clips website. Watch the most recent misfortunes of your favourite streamers, and also upload your clips for others amusement and joy. 
          </p>

          <div className="flex justify-center mb-8">
            <picture>
              <source srcSet="/alkLFG-4x.avif" type="image/avif" />
              <source srcSet="/alkLFG-4x.webp" type="image/webp" />
              <img
                src="/alkLFG-4x.gif"
                alt="alkLFG"
                className="rounded-lg shadow-lg max-h-[400px] w-auto"
              />
            </picture>
          </div>          

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-xl border border-red-800"
            >
              Register Now
            </Link>
            <Link 
              href="/clips"
              className="border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-xl"
            >
              Watch RIP Clips
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-950/50 to-black/80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 drop-shadow-lg">
            Games
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <img src="/path_of_exile.jpg" alt="Path of Exile 1" className="w-32 h-40 rounded-lg mx-auto mb-4 shadow-lg border-2 border-red-800 object-cover" />
              <h3 className="text-xl font-semibold text-red-300 mb-2">Path of Exile 1</h3>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <img src="/path_of_exile_2.jpg" alt="Path of Exile 2" className="w-32 h-40 rounded-lg mx-auto mb-4 shadow-lg border-2 border-red-800 object-cover" />
              <h3 className="text-xl font-semibold text-red-300 mb-2">Path of Exile 2</h3>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <img src="/last_epoch.jpg" alt="Last Epoch" className="w-32 h-40 rounded-lg mx-auto mb-4 shadow-lg border-2 border-red-800 object-cover" />
              <h3 className="text-xl font-semibold text-red-300 mb-2">Last Epoch</h3>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <img src="/diablo2.jpg" alt="Diablo 2" className="w-32 h-40 rounded-lg mx-auto mb-4 shadow-lg border-2 border-red-900 object-cover" />
              <h3 className="text-xl font-semibold text-red-300 mb-2">Diablo 2</h3>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <img src="/diablo4.jpg" alt="Diablo 4" className="w-32 h-40 rounded-lg mx-auto mb-4 shadow-lg border-2 border-red-900 object-cover" />
              <h3 className="text-xl font-semibold text-red-300 mb-2">Diablo 4</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 drop-shadow-lg">
            🩸 Why Join RIP Clips? 🩸
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-red-900">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Join Hardcore Community</h3>
              <p className="text-red-200/70">Share your clips for others amusement and enjoy watching others RIP</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-red-900">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Discuss RIP Clips</h3>
              <p className="text-red-200/70">Use comment section to talk about the RIP clips or just leave a git gud message</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-red-900">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M12 7a1 1 0 110-2 1 1 0 010 2zm3 0a1 1 0 110-2 1 1 0 010 2zm-6 0a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-4">🔥 alkLFG 🔥</h3>
              <picture className="block mx-auto">
                <source srcSet="/alkLFG-4x.avif" type="image/avif" />
                <source srcSet="/alkLFG-4x.webp" type="image/webp" />
                <img
                  src="/alkLFG-4x.gif"
                  alt="alkLFG"
                  className="h-24 w-auto mx-auto rounded-lg shadow-lg"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* Development Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-black/80 to-red-950/60">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 drop-shadow-lg">
            Currently in Development 🚀
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-blue-800">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-3">User Profiles</h3>
              <p className="text-red-200/70 text-sm">Containing submission count, likes received, comments posted, comment likes received, top games, and more!</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-700 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-green-800">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-3">Settings</h3>
              <p className="text-red-200/70 text-sm">Page to customize your experience, change layouts, backgrounds, and more.</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-orange-700 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-yellow-800">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-3">Featured RIP Clips</h3>
              <p className="text-red-200/70 text-sm">A featured clip that is quite hot, High profile RIPs, Funniest RIPs, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-950 via-black to-red-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            Ready to join the fun?
          </h2>
          <Link 
            href="/register"
            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-2xl border border-red-900"
          >
            Join RIP clips
          </Link>
        </div>
      </section>
    </div>
  );
}