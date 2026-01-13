import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      setNotifications(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'follow': return '👤';
      case 'like': return '👏';
      case 'comment': return '💬';
      case 'article': return '📝';
      default: return '🔔';
    }
  };

  if (!user) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <h3>Please sign in</h3>
          <p>You need to be logged in to view notifications.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <h3>Loading notifications...</h3>
      </div>
    );
  }

  return (
    <div className="content-container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
      
      <div className="notifications-container">
        <div className="notifications-header">
          <h1 className="notifications-title">Notifications</h1>
          {notifications.some(n => !n.is_read) && (
            <button onClick={markAllAsRead} className="btn-secondary">
              Mark all as read
            </button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications yet</h3>
            <p>When someone follows you or interacts with your content, you'll see it here.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.notification_type)}
                </div>
                
                <div className="notification-content">
                  <div className="notification-header">
                    <div className="sender-info">
                      <div className="sender-avatar">
                        {notification.sender?.first_name 
                          ? notification.sender.first_name[0].toUpperCase()
                          : notification.sender?.email[0].toUpperCase()
                        }
                      </div>
                      <span className="sender-name">
                        {notification.sender?.first_name && notification.sender?.last_name
                          ? `${notification.sender.first_name} ${notification.sender.last_name}`
                          : notification.sender?.username
                        }
                      </span>
                    </div>
                    <span className="notification-date">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  {notification.article && (
                    <Link 
                      to={`/article/${notification.article.slug}`}
                      className="notification-link"
                    >
                      View Article →
                    </Link>
                  )}
                </div>
                
                {!notification.is_read && (
                  <div className="unread-indicator"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;