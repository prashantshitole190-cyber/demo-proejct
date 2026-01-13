import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationsAPI } from '../services/api';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [latestNotification, setLatestNotification] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
    }
  }, [user]);

  useEffect(() => {
    // Update main content margin based on sidebar state
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (user && sidebarOpen) {
        mainContent.classList.remove('sidebar-hidden');
      } else {
        mainContent.classList.add('sidebar-hidden');
      }
    }
  }, [sidebarOpen, user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getAll();
      const notifications = response.data.results || response.data;
      const unread = notifications.filter(n => !n.is_read);
      
      if (unread.length > 0) {
        setLatestNotification(unread[0]);
        setShowNotificationPopup(true);
        setTimeout(() => setShowNotificationPopup(false), 5000);
      }
      
      setUnreadCount(unread.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setAvatarMenuOpen(false);
      setSidebarOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleNotificationClick = () => {
    setUnreadCount(0);
    navigate('/notifications');
  };

  const handleNavigation = (path) => {
    setAvatarMenuOpen(false);
    navigate(path);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          {user && (
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
          )}
          
          <Link to="/" className="logo">
            Medium
          </Link>
          
          <div className="header-search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="search-input"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
            </form>
          </div>
          
          <nav className="nav-links">
            {user ? (
              <div className="user-menu">
                <Link to="/write" className="write-btn">
                  Write
                </Link>
                <button 
                  onClick={handleNotificationClick}
                  className="nav-link notification-link"
                >
                  <svg className="notification-bell" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>
                <div className="user-avatar-menu">
                  {user.avatar ? (
                    <img 
                      src={getImageUrl(user.avatar)} 
                      alt={user.username}
                      className="header-avatar"
                      onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                    />
                  ) : (
                    <div 
                      className="header-avatar"
                      onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                    >
                      {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                  )}
                  
                  {avatarMenuOpen && (
                    <div className="avatar-dropdown">
                      <div className="dropdown-header">
                        <div className="dropdown-user-info">
                          <div className="dropdown-name">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : user.username
                            }
                          </div>
                          <div className="dropdown-email">{maskEmail(user.email)}</div>
                        </div>
                      </div>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        type="button"
                        className="dropdown-item" 
                        onClick={() => handleNavigation('/settings')}
                      >
                        <span className="dropdown-icon">⚙️</span>
                        Settings
                      </button>
                      
                      <button 
                        type="button"
                        className="dropdown-item" 
                        onClick={() => handleNavigation('/help')}
                      >
                        <span className="dropdown-icon">❓</span>
                        Help
                      </button>
                      
                      <button 
                        type="button"
                        className="dropdown-item" 
                        onClick={() => handleNavigation('/about')}
                      >
                        <span className="dropdown-icon">ℹ️</span>
                        About Us
                      </button>
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        type="button"
                        className="dropdown-item logout-item" 
                        onClick={handleLogout}
                      >
                        <span className="dropdown-icon">🚪</span>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Sign In
                </Link>
                <Link to="/register" className="write-btn">
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Sidebar */}
      {user && (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-user">
              {user.avatar ? (
                <img 
                  src={getImageUrl(user.avatar)} 
                  alt={user.username}
                  className="sidebar-avatar"
                />
              ) : (
                <div className="sidebar-avatar">
                  {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
              )}
              <div className="sidebar-user-info">
                <div className="sidebar-username">
                  {user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username
                  }
                </div>
                <div className="sidebar-email">{user.email}</div>
              </div>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <Link to="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <span className="sidebar-icon-text">⌂</span>
              Home
            </Link>
            <Link to="/stories" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <span className="sidebar-icon-text">☰</span>
              Stories
            </Link>
            <Link to="/write" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <span className="sidebar-icon-text">✎</span>
              Write
            </Link>
            <Link to={`/profile/${user.email}`} className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <span className="sidebar-icon-text">⚙</span>
              Profile
            </Link>
            <Link to="/saved" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <span className="sidebar-icon-text">★</span>
              Saved Articles
            </Link>
            <Link to="/following" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
              <span className="sidebar-icon-text">♥</span>
              Following
            </Link>
            <button onClick={handleLogout} className="sidebar-link logout-btn">
              <span className="sidebar-icon-text">→</span>
              Logout
            </button>
          </nav>
        </div>
      )}
      
      {avatarMenuOpen && <div className="dropdown-overlay" onClick={() => setAvatarMenuOpen(false)}></div>}
      
      {showNotificationPopup && latestNotification && (
        <div className="notification-popup">
          <div className="popup-header">
            <span className="popup-icon">🔔</span>
            <span className="popup-title">New Notification</span>
            <button 
              className="popup-close" 
              onClick={() => setShowNotificationPopup(false)}
            >
              ×
            </button>
          </div>
          <div className="popup-content">
            <p>{latestNotification.message}</p>
            {latestNotification.article && (
              <Link 
                to={`/article/${latestNotification.article.slug}`}
                className="popup-link"
                onClick={() => setShowNotificationPopup(false)}
              >
                View Article →
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;