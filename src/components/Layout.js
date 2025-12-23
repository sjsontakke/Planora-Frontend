// // frontend/src/components/Layout.js
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, getProfile } from "../redux/slices/authSlice";
import { useTheme } from "../context/ThemeContext";
import NotificationsPanel from "./NotificationsPanel";
import SearchBar from "./SearchBar";
import UserProfile from "./UserProfile";

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    dispatch(getProfile());
    setShowProfile(!showProfile);
  };

  // Professional SVG Icons
  const SunIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 1V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21V23"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.22 4.22L5.64 5.64"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.36 18.36L19.78 19.78"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 12H3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12H23"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.22 19.78L5.64 18.36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.36 5.64L19.78 4.22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 12.79C20.8427 14.4922 20.2039 16.1144 19.1582 17.4668C18.1126 18.8192 16.7035 19.8458 15.0957 20.4265C13.4879 21.0073 11.748 21.1181 10.0795 20.7461C8.41102 20.3741 6.88299 19.5345 5.67422 18.3258C4.46545 17.117 3.62593 15.589 3.2539 13.9205C2.88187 12.252 2.9927 10.5121 3.57344 8.9043C4.15419 7.29651 5.18082 5.88737 6.5332 4.84175C7.88558 3.79614 9.50779 3.15731 11.21 3C10.2134 4.34827 9.73375 6.00945 9.85843 7.68141C9.98312 9.35338 10.7039 10.9251 11.8894 12.1106C13.0749 13.2961 14.6466 14.0169 16.3186 14.1416C17.9905 14.2662 19.6517 13.7866 21 12.79Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const BellIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-white to-gray-50 text-gray-900"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isDark
            ? "bg-gray-900/95 backdrop-blur-lg border-gray-800"
            : "bg-white/95 backdrop-blur-lg border-gray-100"
        } border-b shadow-sm`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-20">
            {/* Logo and Main Navigation - RESTORED YOUR ORIGINAL LOGO */}
            <div className="flex items-center">
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <div className="inline-block relative">
                  <img
                    src="/logo.png"
                    alt="Planora Logo"
                    className="h-16 w-auto object-contain drop-shadow-lg"
                  />
                </div>
                <span
                  className={`text-xl font-semibold tracking-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                ></span>
              </div>

              <div className="ml-10 flex items-baseline space-x-1">
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isDark
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4 md:space-x-6">
              {/* Search Bar */}
              <SearchBar />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? "text-amber-300 hover:bg-gray-800/50"
                    : "text-amber-500 hover:bg-gray-100/70"
                }`}
                title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100/70"
                }`}
              >
                <BellIcon />
                {/* Notification indicator */}
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              </button>

              {/* User Profile */}
              <button
                onClick={handleProfileClick}
                className={`flex items-center space-x-3 p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                  isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100/70"
                }`}
              >
                {userInfo?.avatar ? (
                  <div className="relative">
                    <img
                      src={userInfo.avatar}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 p-0.5"
                      onError={(e) => {
                        e.target.style.display = "none";
                        const fallback = document.createElement("div");
                        fallback.className =
                          "w-9 h-9 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md";
                        fallback.textContent = userInfo?.name?.charAt(0) || "U";
                        e.target.parentNode.insertBefore(fallback, e.target);
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {userInfo?.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {userInfo?.name || "User"}
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {userInfo?.role || "Member"}
                  </span>
                </div>
              </button>

              {/* Increased gap between profile and logout */}
              <div className="w-4"></div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/login");
                }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* User Profile Modal */}
      {showProfile && <UserProfile onClose={() => setShowProfile(false)} />}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
