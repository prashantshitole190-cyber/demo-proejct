import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    website: '',
    twitter: '',
    linkedin: '',
    github: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        bio: user.bio || '',
        website: user.website || '',
        twitter: user.twitter || '',
        linkedin: user.linkedin || '',
        github: user.github || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.put('/users/profile/', formData);
      updateUser(response.data);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Settings update error:', error);
      setMessage('Error updating settings. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <h3>Please sign in</h3>
          <p>You need to be logged in to access settings.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
      
      <div className="settings-container">
        <h1 className="page-title">Settings</h1>
        
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="First name"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Last name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Appearance</h3>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <span>Dark Mode</span>
              </label>
              <p style={{fontSize: '14px', color: '#6b6b6b', marginTop: '8px'}}>Enable dark theme for better reading at night</p>
            </div>
          </div>

          <div className="form-section">
            <h3>Account Preferences</h3>
            
            <div className="form-group">
              <label className="form-label">Email Notifications</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>New followers</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Article claps</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Comments on my articles</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Weekly digest</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Privacy Settings</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Show my profile to search engines</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Allow others to see my reading list</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Show my claps publicly</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Writing Preferences</h3>
            
            <div className="form-group">
              <label className="form-label">Default Article Visibility</label>
              <select className="form-input">
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Editor Theme</label>
              <select className="form-input">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Auto-save drafts</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Enable spell check</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Social Links</h3>
            
            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="form-input"
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Twitter</label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="form-input"
                placeholder="@username"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="form-input"
                placeholder="linkedin.com/in/username"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">GitHub</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="form-input"
                placeholder="github.com/username"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;