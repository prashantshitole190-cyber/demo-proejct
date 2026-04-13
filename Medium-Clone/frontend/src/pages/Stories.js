import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [importFile, setImportFile] = useState(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/articles/user/stories/?status=${activeTab}`);
      setStories(response.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [activeTab]);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!importFile) return;

    const formData = new FormData();
    formData.append('file', importFile);

    try {
      await api.post('/articles/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImportFile(null);
      fetchStories();
    } catch (error) {
      console.error('Error importing story:', error);
    }
  };

  const getStatusCount = (status) => {
    if (status === 'all') return stories.length;
    return stories.filter(story => story.status === status).length;
  };

  const filteredStories = activeTab === 'all' ? stories : stories.filter(story => story.status === activeTab);

  return (
    <div className="page-container">
      <div className="page-content">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
        
        <div className="stories-container">
          <div className="stories-header">
            <h1>Your stories</h1>
            <div className="import-section">
              <form onSubmit={handleImport} className="import-form">
                <input
                  type="file"
                  accept=".txt,.md,.html"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="import-input"
                />
                <button type="submit" disabled={!importFile} className="import-btn">
                  Import story
                </button>
              </form>
            </div>
          </div>

          <div className="stories-tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({getStatusCount('all')})
            </button>
            <button
              className={`tab ${activeTab === 'draft' ? 'active' : ''}`}
              onClick={() => setActiveTab('draft')}
            >
              Drafts ({getStatusCount('draft')})
            </button>
            <button
              className={`tab ${activeTab === 'scheduled' ? 'active' : ''}`}
              onClick={() => setActiveTab('scheduled')}
            >
              Scheduled ({getStatusCount('scheduled')})
            </button>
            <button
              className={`tab ${activeTab === 'published' ? 'active' : ''}`}
              onClick={() => setActiveTab('published')}
            >
              Published ({getStatusCount('published')})
            </button>
          </div>

          <div className="stories-list">
            {loading ? (
              <div className="loading">Loading stories...</div>
            ) : filteredStories.length === 0 ? (
              <div className="empty-state">
                <h3>No stories yet</h3>
                <p>Start writing your first story</p>
                <Link to="/write" className="write-btn">
                  Write a story
                </Link>
              </div>
            ) : (
              filteredStories.map(story => (
                <div key={story.id} className="story-item">
                  <div className="story-content">
                    <Link to={`/article/${story.slug}`} className="story-title">
                      {story.title}
                    </Link>
                    <p className="story-excerpt">{story.excerpt}</p>
                    <div className="story-meta">
                      <span className="story-date">
                        {new Date(story.created_at).toLocaleDateString()}
                      </span>
                      <span className={`story-status ${story.status}`}>
                        {story.status}
                      </span>
                      <span className="story-stats">
                        {story.views_count} views • {story.claps_count} claps
                      </span>
                    </div>
                  </div>
                  <div className="story-actions">
                    <Link to={`/write/${story.slug}`} className="edit-btn">
                      Edit
                    </Link>
                    {story.status === 'draft' && (
                      <Link to={`/write/${story.slug}`} className="publish-btn">
                        Publish
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stories;