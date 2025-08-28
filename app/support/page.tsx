"use client";

import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black text-red-200">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-red-500 mb-4 drop-shadow-lg">
              Support RIP Clips
            </h1>
            <p className="text-lg text-red-300 max-w-2xl mx-auto leading-relaxed">
              Your support helps us stay caffeinated, improve the site, and bring exciting new features to the Hardcore community. Every contribution counts!
            </p>
          </div>

          {/* Support Options */}
          <div className="flex justify-center">
            {/* Combined Support Section */}
            <div className="bg-gray-900 border border-red-800 rounded-lg p-3 shadow-2xl max-w-md w-full">
              <div className="text-center mb-3">
                <Link
                  href="https://buymeacoffee.com/ladno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all shadow-lg border border-yellow-800 mt-2"
                >
                  <span>☕Click to Buy Me a Coffee☕</span>
                </Link>

                <p className="text-red-300 text-center mt-3">
                  OR
                </p>
              </div>
              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-lg shadow-lg">
                  <img 
                    src="/bmc_qr.png"
                    alt="Buy Me a Coffee QR Code"
                    className="w-55 h-55 rounded"
                  />
                </div>
              </div>
              <p className="text-red-300 text-center text-sm">
                Quick Scan for Support
              </p>
            </div>
          </div>

          {/* Why Support Section */}
          <div className="mt-16 bg-gray-900 border border-red-800 rounded-lg p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-red-400 mb-6 text-center">
              💀 Why Support RIP Clips? 💀
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl">🔧</div>
                <h3 className="text-red-300 font-medium">Site Maintenance</h3>
                <p className="text-sm text-red-400">
                  Keep servers running and ensure smooth performance
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">✨</div>
                <h3 className="text-red-300 font-medium">New Features</h3>
                <p className="text-sm text-red-400">
                  Add new tools, filters, and improvements based on feedback
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-3xl">📈</div>
                <h3 className="text-red-300 font-medium">Growth</h3>
                <p className="text-sm text-red-400">
                  Expand our clip database and enhance user experience
                </p>
              </div>
            </div>
          </div>

          {/* Back to Site */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-red-300 hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to RIP Clips</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}