import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Following = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  const fetchFollowing = async () => {
    try {
      const response = await api.get('/users/following/');
      setFollowing(response.data);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (email) => {
    try {
      await api.delete(`/users/${email}/follow/`);
      setFollowing(following.filter(f => f.email !== email));
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  if (!user) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <h3>Please sign in</h3>
          <p>You need to be logged in to see who you're following.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <h3>Loading following...</h3>
      </div>
    );
  }

  return (
    <div className="content-container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
      
      <div className="following-container">
        <h1 className="page-title">Following ({following.length})</h1>
        
        {following.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>You're not following anyone yet</h3>
            <p>Discover writers and follow them to see their stories in your feed.</p>
            <Link to="/" className="btn-primary">Explore Stories</Link>
          </div>
        ) : (
          <div className="following-list">
            {following.map((person) => (
              <div key={person.id} className="following-item">
                <div className="following-user">
                  {person.avatar ? (
                    <img 
                      src={getImageUrl(person.avatar)} 
                      alt={person.username}
                      className="following-avatar"
                    />
                  ) : (
                    <div className="following-avatar">
                      {person.first_name ? person.first_name[0].toUpperCase() : person.email[0].toUpperCase()}
                    </div>
                  )}
                  
                  <div className="following-info">
                    <Link 
                      to={`/profile/${person.email}`} 
                      className="following-name"
                    >
                      {person.first_name && person.last_name
                        ? `${person.first_name} ${person.last_name}`
                        : person.username
                      }
                    </Link>
                    <p className="following-bio">{person.bio || 'No bio available'}</p>
                    <div className="following-stats">
                      <span>{person.followers_count} followers</span>
                      <span>•</span>
                      <span>{person.following_count} following</span>
                    </div>
                  </div>
                </div>
                
                <div className="following-actions">
                  <Link 
                    to={`/profile/${person.email}`} 
                    className="btn-secondary"
                  >
                    View Profile
                  </Link>
                  <button 
                    onClick={() => handleUnfollow(person.email)}
                    className="btn-outline"
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Following;