import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logoGym.png";
import { FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      window.location.href = "http://localhost:8080/logout";
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-md z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Learn Star
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <FaSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {user && (
              <div className="relative">
                <button 
                className="flex items-center space-x-2 group"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="relative">
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-10 h-10 rounded-full border-2 border-purple-500 transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                  <span className="hidden md:block text-gray-700 dark:text-gray-200 font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {user.name}
                </span>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
