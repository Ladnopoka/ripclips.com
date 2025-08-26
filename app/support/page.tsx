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
              🩸 Support RIP Clips 🩸
            </h1>
            <p className="text-lg text-red-300 max-w-2xl mx-auto leading-relaxed">
              If you're enjoying the website and the RIP clips content, please support us to help improve the site and add new features!
            </p>
          </div>

          {/* Support Options */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Buy Me a Coffee Section */}
            <div className="bg-gray-900 border border-red-800 rounded-lg p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-red-400 mb-6 text-center">
                ☕ Buy Me a Coffee
              </h2>
              <div className="text-center mb-6">
                <Link
                  href="https://buymeacoffee.com/ladno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-6 py-3 rounded-lg text-lg font-medium transition-all shadow-lg border border-yellow-800"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20,3H4V2A1,1 0 0,0 3,1A1,1 0 0,0 2,2V21A1,1 0 0,0 3,22A1,1 0 0,0 4,21V20H20A2,2 0 0,0 22,18V5A2,2 0 0,0 20,3M20,18H4V5H20"/>
                  </svg>
                  <span>Support on Buy Me a Coffee</span>
                </Link>
              </div>
              <p className="text-red-300 text-center">
                Every coffee helps us maintain servers, add new features, and keep RIP Clips running smoothly!
              </p>
            </div>

            {/* QR Code Section */}
            <div className="bg-gray-900 border border-red-800 rounded-lg p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold text-red-400 mb-6 text-center">
                📱 Quick Scan
              </h2>
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-600 rounded">
                    {/* Placeholder for QR code */}
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H15V11M19,5H21V9H19V5M5,3H9V7H5V3M3,19H7V21H5V19H3V19M5,5V5H7V7H5V5M15,21H19V19H17V21H15V21M19,19V19H21V21H19V19M17,17V19H15V17H17M13,17H15V19H13V17M15,15H17V17H15V15M3,15H5V17H3V15M5,17V17H7V19H5V17M19,13V15H17V13H19M21,11H19V13H21V11M7,13H9V15H7V13M13,5V7H11V5H13M21,3H17V7H19V5H21V3M7,3V5H9V7H7V9H5V7H3V5H5V3H7M21,15V17H19V15H21Z"/>
                      </svg>
                      <p className="text-sm">QR Code will be here</p>
                      <p className="text-xs mt-1">Add bmc_qr_png to /public</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-red-300 text-center text-sm">
                Scan with your phone to support us quickly!
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