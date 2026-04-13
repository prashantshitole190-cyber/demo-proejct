import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const SavedArticles = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSavedArticles();
    }
  }, [user]);

  const fetchSavedArticles = async () => {
    try {
      const response = await api.get('/interactions/saved/');
      setSavedArticles(response.data);
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    } finally {
      setLoading(false);
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

  if (!user) {
    return (
      <div className="content-container">
        <div className="empty-state">
          <h3>Please sign in</h3>
          <p>You need to be logged in to view saved articles.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <h3>Loading saved articles...</h3>
      </div>
    );
  }

  return (
    <div className="content-container">
      <Link to="/" className="back-button">
        ← Back to Home
      </Link>
      
      <div className="saved-articles-container">
        <h1 className="page-title">Saved Articles</h1>
        
        {savedArticles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔖</div>
            <h3>No saved articles yet</h3>
            <p>Articles you bookmark will appear here for easy access later.</p>
            <Link to="/" className="btn-primary">Discover Articles</Link>
          </div>
        ) : (
          <div className="articles-grid">
            {savedArticles.map((article) => (
              <Link 
                key={article.id} 
                to={`/article/${article.slug}`} 
                className="article-card"
              >
                <div className="article-content">
                  <div className="article-author">
                    <div className="author-avatar">
                      {article.author?.first_name 
                        ? article.author.first_name[0].toUpperCase()
                        : article.author?.email[0].toUpperCase()
                      }
                    </div>
                    <div className="author-info">
                      <span className="author-name">
                        {article.author?.first_name && article.author?.last_name
                          ? `${article.author.first_name} ${article.author.last_name}`
                          : article.author?.username
                        }
                      </span>
                      <span className="article-date">
                        {formatDate(article.created_at)}
                      </span>
                    </div>
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
                        <span className="article-tag">{article.tags[0].name}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {article.featured_image && (
                  <div className="article-image-wrapper">
                    <img 
                      src={getImageUrl(article.featured_image)} 
                      alt={article.title}
                      className="article-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedArticles;