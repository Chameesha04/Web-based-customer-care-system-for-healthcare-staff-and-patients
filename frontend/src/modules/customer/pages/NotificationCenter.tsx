import React, { useState, useEffect } from 'react';
import { 
  BellIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { Notification, NotificationType, NotificationPriority } from '../../../types';
import apiService from '../../../services/api';
import { useNotifications } from '../../../contexts/NotificationContext';

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'ALL'>('ALL');
  const { markAsRead, markAllAsRead, unreadCount } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotifications(0, 100);
      setNotifications(response.content);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Notifications error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        )
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date().toISOString()
        }))
      );
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case NotificationPriority.LOW: return 'bg-gray-100 text-gray-800';
      case NotificationPriority.NORMAL: return 'bg-blue-100 text-blue-800';
      case NotificationPriority.HIGH: return 'bg-orange-100 text-orange-800';
      case NotificationPriority.URGENT: return 'bg-red-100 text-red-800';
      case NotificationPriority.CRITICAL: return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.APPOINTMENT_REMINDER:
      case NotificationType.APPOINTMENT_CONFIRMED:
      case NotificationType.APPOINTMENT_CANCELLED:
      case NotificationType.APPOINTMENT_RESCHEDULED:
        return '📅';
      case NotificationType.TICKET_ASSIGNED:
      case NotificationType.TICKET_UPDATED:
      case NotificationType.TICKET_RESOLVED:
        return '🎫';
      case NotificationType.QUEUE_UPDATE:
        return '⏰';
      case NotificationType.SCHEDULE_CHANGE:
        return '📋';
      case NotificationType.SYSTEM_ALERT:
        return '⚠️';
      case NotificationType.EMERGENCY:
        return '🚨';
      case NotificationType.MAINTENANCE:
        return '🔧';
      case NotificationType.SECURITY_ALERT:
        return '🔒';
      default:
        return '🔔';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'ALL' || 
                         (filter === 'UNREAD' && !notification.isRead) ||
                         (filter === 'READ' && notification.isRead);
    const matchesType = typeFilter === 'ALL' || notification.type === typeFilter;
    
    return matchesFilter && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-healthcare-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={loadNotifications}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="mt-2 text-gray-600">Stay updated with your healthcare activities</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn-secondary"
          >
            <EyeIcon className="h-5 w-5 mr-2" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BellIcon className="h-8 w-8 text-healthcare-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Notifications</p>
              <p className="text-2xl font-semibold text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeSlashIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread</p>
              <p className="text-2xl font-semibold text-gray-900">{unreadCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Read</p>
              <p className="text-2xl font-semibold text-gray-900">{notifications.length - unreadCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'ALL' | 'UNREAD' | 'READ')}
              className="input-field"
            >
              <option value="ALL">All Notifications</option>
              <option value="UNREAD">Unread Only</option>
              <option value="READ">Read Only</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as NotificationType | 'ALL')}
              className="input-field"
            >
              <option value="ALL">All Types</option>
              <option value={NotificationType.APPOINTMENT_REMINDER}>Appointment Reminders</option>
              <option value={NotificationType.APPOINTMENT_CONFIRMED}>Appointment Confirmations</option>
              <option value={NotificationType.APPOINTMENT_CANCELLED}>Appointment Cancellations</option>
              <option value={NotificationType.TICKET_ASSIGNED}>Ticket Assignments</option>
              <option value={NotificationType.TICKET_UPDATED}>Ticket Updates</option>
              <option value={NotificationType.TICKET_RESOLVED}>Ticket Resolutions</option>
              <option value={NotificationType.QUEUE_UPDATE}>Queue Updates</option>
              <option value={NotificationType.SYSTEM_ALERT}>System Alerts</option>
              <option value={NotificationType.EMERGENCY}>Emergency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="card">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
                  notification.isRead ? 'border-gray-200 bg-gray-50' : 'border-healthcare-200 bg-white'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-2xl">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-medium ${
                        notification.isRead ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        {!notification.isRead && (
                          <div className="h-2 w-2 bg-healthcare-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className={`text-sm ${
                      notification.isRead ? 'text-gray-500' : 'text-gray-700'
                    }`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatDate(notification.createdAt)}
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-sm text-healthcare-600 hover:text-healthcare-700 font-medium"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter !== 'ALL' || typeFilter !== 'ALL'
                ? 'Try adjusting your filters.'
                : 'You\'re all caught up! No notifications at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;

