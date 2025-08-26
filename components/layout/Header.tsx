"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/AuthContext";
import { useAuth } from "@/lib/useAuth";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export const Header: React.FC = () => {
  const { user, loading } = useAuthContext();
  const { logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push("/");
  };

  const getUserInitials = (displayName: string | null) => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-black border-b border-red-900 sticky top-0 z-50 shadow-lg shadow-red-900/20">
      <div className="px-4 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-red-500 drop-shadow-lg whitespace-nowrap">🩸RIP Clips🩸</div>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-red-200 hover:text-red-400 transition-colors font-medium">
                About
              </Link>
              <Link href="/clips" className="text-red-200 hover:text-red-400 transition-colors font-medium">
                Browse Clips
              </Link>
              <Link href="/support" className="text-red-200 hover:text-red-400 transition-colors font-medium flex items-center space-x-1">
                <span>☕Support</span>
              </Link>
            </nav>
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {/* Submit Clip Button - Always visible like Reddit's + Create */}
            <Link 
              href="/upload"
              className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-md text-sm font-medium transition-all shadow-lg border border-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Submit</span>
            </Link>

            {loading ? (
              <LoadingSpinner size="sm" />
            ) : user ? (
              /* Logged in user menu */
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-red-200 hover:text-red-400 transition-colors"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg border border-red-700">
                    {getUserInitials(user.displayName)}
                  </div>
                  <span className="hidden sm:block">{user.displayName || "User"}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-2xl border border-red-800 z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-red-300 border-b border-red-800">
                        Signed in as <br />
                        <span className="text-red-400 font-medium">{user.email}</span>
                      </div>
                      <Link 
                        href="/profile"
                        className="block px-4 py-2 text-sm text-red-200 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        href="/settings"
                        className="block px-4 py-2 text-sm text-red-200 hover:bg-red-900/50 hover:text-red-400 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Settings
                      </Link>
                      {/* Show admin link for admin users */}
                      {user && ['ladnopokaa@gmail.com', 'ivanovworkbusiness@gmail.com'].includes(user.email || '') && (
                        <Link 
                          href="/admin"
                          className="block px-4 py-2 text-sm text-yellow-400 hover:bg-red-900/50 hover:text-yellow-300 transition-colors border-t border-red-800"
                          onClick={() => setShowUserMenu(false)}
                        >
                          👑 Admin Panel
                        </Link>
                      )}
                      <hr className="border-red-800" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-200 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                      >
                        🩸 Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in - show login button */
              <div className="flex items-center space-x-3 whitespace-nowrap">
                <Link 
                  href="/login"
                  className="text-red-200 hover:text-red-400 transition-colors font-medium"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};