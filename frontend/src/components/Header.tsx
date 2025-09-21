import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, UserCircleIcon, ChevronDownIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const notifications = [
    { id: 1, message: 'New appointment scheduled', time: '2 min ago', unread: true },
    { id: 2, message: 'Patient check-in completed', time: '15 min ago', unread: true },
    { id: 3, message: 'System maintenance scheduled', time: '1 hour ago', unread: false },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-8 py-6">
        {/* Welcome Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-healthcare-500 to-healthcare-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-sm text-gray-600">Here's what's happening today</p>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
              <BellIcon className="h-6 w-6" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.filter(n => n.unread).length}
                </span>
              )}
            </button>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</span>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Preferences
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


