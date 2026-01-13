import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Profile = () => {
  const [profileUser, setProfileUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  
  const { username } = useParams();
  const { user } = useAuth();
  const isOwnProfile = user && user.email === username;

  useEffect(() => {
    fetchProfile();
    fetchUserArticles();
    if (user && !isOwnProfile) {
      checkFollowStatus();
    }
  }, [username, user, isOwnProfile]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${username}/`);
      setProfileUser(response.data);
      setEditForm({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        bio: response.data.bio || '',
        website: response.data.website || '',
        twitter: response.data.twitter || '',
        linkedin: response.data.linkedin || '',
        github: response.data.github || ''
      });
    } catch (error) {
      setError('User not found');
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserArticles = async () => {
    try {
      const response = await api.get(`/users/${username}/articles/`);
      setArticles(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching user articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await api.get('/users/following/');
      const followingUsers = response.data;
      const isUserFollowed = followingUsers.some(followedUser => followedUser.email === username);
      setIsFollowing(isUserFollowed);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/${username}/follow/`);
        setIsFollowing(false);
        setProfileUser(prev => ({
          ...prev,
          followers_count: (prev.followers_count || 0) - 1
        }));
      } else {
        await api.post(`/users/${username}/follow/`);
        setIsFollowing(true);
        setProfileUser(prev => ({
          ...prev,
          followers_count: (prev.followers_count || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      
      if (avatarFile) {
        // If avatar file is selected, use FormData with all fields
        const formData = new FormData();
        formData.append('first_name', editForm.first_name);
        formData.append('last_name', editForm.last_name);
        formData.append('bio', editForm.bio);
        formData.append('website', editForm.website);
        formData.append('twitter', editForm.twitter);
        formData.append('linkedin', editForm.linkedin);
        formData.append('github', editForm.github);
        formData.append('avatar', avatarFile);
        
        response = await api.put('/users/profile/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // If no avatar, use JSON data
        const profileData = {
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          bio: editForm.bio,
          website: editForm.website,
          twitter: editForm.twitter,
          linkedin: editForm.linkedin,
          github: editForm.github
        };
        
        response = await api.put('/users/profile/', profileData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      setProfileUser(response.data);
      setIsEditing(false);
      setAvatarFile(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8000${imagePath}`;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <h3>Loading profile...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-container">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        <div className="error">
          <h3>{error}</h3>
          <p>The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="content-container">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
      </div>
      
      <div className="profile-header">
        <div className="container">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="profile-edit-form">
              <div className="avatar-upload">
                {profileUser?.avatar ? (
                  <img 
                    src={getImageUrl(profileUser.avatar)} 
                    alt={profileUser.username}
                    className="profile-avatar"
                    style={{borderRadius: '50%', objectFit: 'cover'}}
                  />
                ) : (
                  <div className="profile-avatar">
                    {profileUser?.first_name 
                      ? profileUser.first_name[0].toUpperCase()
                      : profileUser?.email[0].toUpperCase()
                    }
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="avatar-input"
                />
              </div>
              
              <div className="form-row">
                <input
                  type="text"
                  name="first_name"
                  value={editForm.first_name}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="form-input"
                />
                <input
                  type="text"
                  name="last_name"
                  value={editForm.last_name}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="form-input"
                />
              </div>
              
              <textarea
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                placeholder="Bio"
                className="form-textarea"
                rows="3"
              />
              
              <input
                type="url"
                name="website"
                value={editForm.website}
                onChange={handleInputChange}
                placeholder="Website"
                className="form-input"
              />
              
              <div className="form-actions">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              {profileUser?.avatar ? (
                <img 
                  src={getImageUrl(profileUser.avatar)} 
                  alt={profileUser.username}
                  className="profile-avatar"
                  style={{borderRadius: '50%', objectFit: 'cover'}}
                />
              ) : (
                <div className="profile-avatar">
                  {profileUser?.first_name 
                    ? profileUser.first_name[0].toUpperCase()
                    : profileUser?.email[0].toUpperCase()
                  }
                </div>
              )}
              
              <h1 className="profile-name">
                {profileUser?.first_name && profileUser?.last_name
                  ? `${profileUser.first_name} ${profileUser.last_name}`
                  : profileUser?.username
                }
              </h1>
              
              {profileUser?.bio && (
                <p className="profile-bio">{profileUser.bio}</p>
              )}
              
              <div className="profile-stats">
                <div className="stat">
                  <div className="stat-number">{profileUser?.followers_count || 0}</div>
                  <div className="stat-label">Followers</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{profileUser?.following_count || 0}</div>
                  <div className="stat-label">Following</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{articles.length}</div>
                  <div className="stat-label">Stories</div>
                </div>
              </div>
              
              {isOwnProfile ? (
                <div style={{marginTop: '24px'}}>
                  <button onClick={() => setIsEditing(true)} className="btn-secondary">
                    Edit Profile
                  </button>
                  <Link to="/write" className="btn-primary" style={{marginLeft: '12px'}}>
                    Write a story
                  </Link>
                </div>
              ) : (
                <div style={{marginTop: '24px'}}>
                  <button 
                    onClick={handleFollow}
                    className={`btn-primary ${followLoading ? 'loading' : ''}`}
                    disabled={followLoading}
                  >
                    {followLoading ? 'Loading...' : (isFollowing ? 'Unfollow' : 'Follow')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <section className="articles-section">
        <div className="container">
          <h2 className="section-title">
            {isOwnProfile ? 'Your Stories' : 'Stories'}
          </h2>
          
          {articles.length === 0 ? (
            <div className="empty-state">
              <h3>No stories yet</h3>
              <p>
                {isOwnProfile 
                  ? "You haven't written any stories yet."
                  : "This user hasn't written any stories yet."
                }
              </p>
              {isOwnProfile && (
                <Link to="/write" className="btn-primary">
                  Write your first story
                </Link>
              )}
            </div>
          ) : (
            <div className="articles-grid">
              {articles.map((article) => (
                <Link 
                  key={article.id} 
                  to={`/article/${article.slug}`} 
                  className="article-card"
                >
                  <div className="article-content">
                    <div className="article-author">
                      <span className="article-date">
                        {formatDate(article.created_at)}
                      </span>
                    </div>
                    
                    <h3 className="article-title">{article.title}</h3>
                    
                    {article.excerpt && (
                      <p className="article-excerpt">{article.excerpt}</p>
                    )}
                    
                    <div className="article-meta">
                      <span>{article.read_time} min read</span>
                      <span>•</span>
                      <span>{article.views_count} views</span>
                      {article.tags && article.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{article.tags[0].name}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {article.featured_image && (
                    <img 
                      src={getImageUrl(article.featured_image)} 
                      alt={article.title}
                      className="article-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;