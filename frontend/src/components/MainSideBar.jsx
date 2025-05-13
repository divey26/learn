import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHome, FaPlus, FaClipboardList, FaUtensils, FaSignOutAlt, FaUsers } from "react-icons/fa";

const MainSideBar = ({ user, isOpen }) => {
  const handleLogout = async () => {
    try {
      window.location.href = "http://localhost:8080/logout";
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { path: "/", icon: <FaHome className="w-5 h-5" />, label: "Home" },
    { path: "/post", icon: <FaPlus className="w-5 h-5" />, label: "Create Post" },
    { path: "/CreateLearningStatus", icon: <FaClipboardList className="w-5 h-5" />, label: "Learning Status" },
    { path: "/CreateLearningPlan", icon: <FaClipboardList className="w-5 h-5" />, label: "Learning Plan" },
    { path: "/active-users", icon: <FaUsers className="w-5 h-5" />, label: "Active Users" },
  ];

  return (
    <div 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-purple-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-30
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="p-6">
          <Link
            to={`/profile/${user?.id}`}
            className="flex items-center space-x-4 group"
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-[2px]">
                <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-800">
                  <img
                    className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                    src={user?.profileImage}
                    alt="profile"
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md"></div>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400"
                  }`
                }
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MainSideBar;
