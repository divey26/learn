import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:8080/users');
        // Filter out the current user from the list
        const filteredUsers = Array.isArray(response.data) 
          ? response.data.filter(u => u.id !== user?.id)
          : [];
        setActiveUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users');
        setActiveUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchActiveUsers();
      const interval = setInterval(fetchActiveUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [user]); // Add user as dependency since we need it for filtering

  return (
    <Layout user={user}>
      <div className="max-w-5xl mx-auto px-4 bg-white dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Active Users</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-black dark:border-white/20">
            {activeUsers.length} {activeUsers.length === 1 ? 'user' : 'users'} online
          </p>
        </div>
        
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeUsers.map((activeUser) => (
              <Link
                to={`/profile/${activeUser.id}`}
                key={activeUser.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group transform hover:-translate-y-1 border border-transparent dark:border-white/20"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={activeUser.profileImage}
                        alt={activeUser.name}
                        className="w-16 h-16 rounded-full border-2 border-purple-500 transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                        {activeUser.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activeUser.email}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-300 mt-1">
                        Active now
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Click to view profile
                      </p>
                      <span className="text-purple-600 dark:text-purple-400 text-sm group-hover:translate-x-1 transition-transform duration-200">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && !error && activeUsers.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-black dark:border-white/20">
            <p className="text-gray-500 dark:text-gray-300 text-lg">No other users available</p>
            <p className="text-gray-400 dark:text-gray-200 text-sm mt-2">Check back later!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActiveUsers; 