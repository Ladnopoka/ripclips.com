"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-red-950">
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
            ⚰️ Death Arenas ⚰️
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-700 rounded-full mx-auto mb-4 shadow-lg border-2 border-red-800"></div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Path of Exile</h3>
              <p className="text-red-200/70">💀 Brutal boss encounters, build failures, and hardcore devastation</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-red-700 rounded-full mx-auto mb-4 shadow-lg border-2 border-red-800"></div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Last Epoch</h3>
              <p className="text-red-200/70">⚔️ Time-twisted deaths and legendary character losses</p>
            </div>
            <div className="bg-gradient-to-b from-gray-900 to-red-950/50 p-6 rounded-xl text-center border border-red-900/50 shadow-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full mx-auto mb-4 shadow-lg border-2 border-red-900"></div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">Diablo Series</h3>
              <p className="text-red-200/70">🔥 Demonic executions and treasure hunt disasters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 drop-shadow-lg">
            🩸 Why Join the Bloodbath? 🩸
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-red-900">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">💀 Easy Submission</h3>
              <p className="text-red-200/70">Submit brutal Twitch clips and YouTube deaths with ease</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-red-900">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">⚔️ Death Community</h3>
              <p className="text-red-200/70">Join fellow death-watchers and share in the carnage</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg border border-red-900">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-300 mb-2">🔥 Legendary Deaths</h3>
              <p className="text-red-200/70">Witness the most spectacular character annihilations</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-950 via-black to-red-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            ⚰️ Ready to Witness the Carnage? ⚰️
          </h2>
          <p className="text-red-200 mb-8 text-lg drop-shadow-lg">
            💀 Join thousands of death-seekers watching the most brutal ARPG moments ever recorded.
          </p>
          <Link 
            href="/register"
            className="bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white px-8 py-3 rounded-lg text-lg font-medium transition-all shadow-2xl border border-red-900"
          >
            🩸 Enter the Arena
          </Link>
        </div>
      </section>
    </div>
  );
}