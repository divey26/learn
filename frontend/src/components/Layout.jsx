import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import MainSideBar from "./MainSideBar";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));//layouttt
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar user={user} />
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200 md:hidden"
      >
        {isSidebarOpen ? <FaTimes className="w-5 h-5 dark:text-white" /> : <FaBars className="w-5 h-5 dark:text-white" />}
      </button>
      <MainSideBar user={user} isOpen={isSidebarOpen} />
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'} pt-16`}>
        <div className="max-w-4xl mx-auto p-6 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 rounded-lg shadow-md">
          {React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, { user })
              : child
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
