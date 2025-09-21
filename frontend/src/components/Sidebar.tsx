import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavigationItems = () => {
    if (!user) return [];

    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    ];

    switch (user.role) {
      case 'CUSTOMER':
        return [
          ...baseItems,
          { name: 'My Bookings', href: '/customer/bookings', icon: CalendarIcon },
          { name: 'Support', href: '/customer/support', icon: ChatBubbleLeftRightIcon },
        ];
      case 'RECEPTIONIST':
        return [
          ...baseItems,
          { name: 'Appointments', href: '/receptionist/appointments', icon: CalendarIcon },
          { name: 'Schedule', href: '/receptionist/schedule', icon: ClockIcon },
        ];
      case 'SMO':
        return [
          ...baseItems,
          { name: 'Case Approvals', href: '/smo/cases', icon: ClipboardDocumentCheckIcon },
          { name: 'Statistics', href: '/smo/statistics', icon: UserGroupIcon },
        ];
      case 'STAFF':
        return [
          ...baseItems,
          { name: 'My Schedule', href: '/staff/schedule', icon: ClockIcon },
          { name: 'Availability', href: '/staff/availability', icon: CalendarIcon },
        ];
      case 'SUPPORT':
        return [
          ...baseItems,
          { name: 'Support Tickets', href: '/support/tickets', icon: ChatBubbleLeftRightIcon },
        ];
      case 'ADMIN':
        return [
          ...baseItems,
          { name: 'Users', href: '/admin/users', icon: UserGroupIcon },
          { name: 'System Health', href: '/admin/system', icon: CogIcon },
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex flex-col w-72 bg-gradient-to-b from-white to-gray-50 shadow-2xl border-r border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-center h-20 bg-gradient-to-r from-healthcare-600 to-healthcare-700 text-white">
        <div className="flex items-center space-x-3">
          <HeartIcon className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Healthcare Care</h1>
            <p className="text-xs text-healthcare-100">Patient Management System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-healthcare-500 to-healthcare-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          <p>Healthcare Care System v1.0</p>
          <p className="mt-1">© 2024 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


