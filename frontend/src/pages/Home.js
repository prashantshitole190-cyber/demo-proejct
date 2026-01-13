import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [activeTab, setActiveTab] = useState('for-you');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
    fetchTags();
  }, [selectedTag, activeTab]);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles/');
      const allArticles = response.data.results || response.data;
      setArticles(allArticles);
      setFeaturedArticles(allArticles.slice(0, 3));
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get('/articles/tags/');
      setTags(response.data.slice(0, 10));
    } catch (error) {
      console.error('Error fetching tags:', error);
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

  const trendingTopics = [
    'Technology', 'Programming', 'Design', 'Startup', 'Life', 'Health', 'Science', 'Politics'
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <h3>Loading stories...</h3>
      </div>
    );
  }

  return (
    <div className="home-page">
      {!user && (
        <section className="hero-section">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Human stories & ideas</h1>
              <p className="hero-subtitle">
                A place to read, write, and deepen your understanding
              </p>
              <Link to="/register" className="hero-cta">
                Start reading
              </Link>
            </div>
          </div>
        </section>
      )}
      
      <div className="home-layout">
        <div className="home-container">
          {user && (
            <div className="home-tabs">
              <button 
                className={`home-tab ${activeTab === 'for-you' ? 'active' : ''}`}
                onClick={() => setActiveTab('for-you')}
              >
                For you
              </button>
              <button 
                className={`home-tab ${activeTab === 'featured' ? 'active' : ''}`}
                onClick={() => setActiveTab('featured')}
              >
                Featured
              </button>
            </div>
          )}
          
          <div className="home-content">
            <main className="home-main">
              {user && featuredArticles.length > 0 && activeTab === 'featured' && (
                <section className="featured-section">
                  <div className="featured-grid">
                    {featuredArticles.map((article, index) => (
                      <Link 
                        key={article.id} 
                        to={`/article/${article.slug}`} 
                        className={`featured-card ${index === 0 ? 'featured-large' : ''}`}
                      >
                        {article.featured_image && (
                          <div className="featured-image">
                            <img 
                              src={getImageUrl(article.featured_image)} 
                              alt={article.title}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        <div className="featured-content">
                          <div className="featured-author">
                            <Link to={`/profile/${article.author?.email}`} className="author-avatar">
                              {article.author?.first_name 
                                ? article.author.first_name[0].toUpperCase()
                                : article.author?.email[0].toUpperCase()
                              }
                            </Link>
                            <Link to={`/profile/${article.author?.email}`} className="author-name">
                              {article.author?.first_name && article.author?.last_name
                                ? `${article.author.first_name} ${article.author.last_name}`
                                : article.author?.username
                              }
                            </Link>
                          </div>
                          <h3 className="featured-title">{article.title}</h3>
                          {article.excerpt && (
                            <p className="featured-excerpt">{article.excerpt}</p>
                          )}
                          <div className="featured-meta">
                            <span>{formatDate(article.created_at)}</span>
                            <span>•</span>
                            <span>{article.read_time} min read</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
              
              <section className="articles-section">
                {articles.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h3>No stories yet</h3>
                    <p>Be the first to share your story with the world!</p>
                    {user && (
                      <Link to="/write" className="btn-primary">
                        Write your first story
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="articles-list">
                    {articles.map((article) => (
                      <Link 
                        key={article.id} 
                        to={`/article/${article.slug}`} 
                        className="article-card"
                      >
                        <div className="article-content">
                          <div className="article-author">
                            <Link to={`/profile/${article.author?.email}`} className="author-avatar">
                              {article.author?.first_name 
                                ? article.author.first_name[0].toUpperCase()
                                : article.author?.email[0].toUpperCase()
                              }
                            </Link>
                            <div className="author-info">
                              <Link to={`/profile/${article.author?.email}`} className="author-name">
                                {article.author?.first_name && article.author?.last_name
                                  ? `${article.author.first_name} ${article.author.last_name}`
                                  : article.author?.username
                                }
                              </Link>
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
              </section>
            </main>
            
            <aside className="home-sidebar">
              <div className="sidebar-section">
                <h3 className="sidebar-title">Trending topics</h3>
                <div className="trending-topics">
                  {trendingTopics.map((topic, index) => (
                    <span key={index} className="trending-topic">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="sidebar-section">
                <h3 className="sidebar-title">Who to follow</h3>
                <div className="follow-suggestions">
                  <div className="follow-item">
                    <div className="follow-avatar">JS</div>
                    <div className="follow-info">
                      <div className="follow-name">JavaScript Weekly</div>
                      <div className="follow-desc">Weekly JS news and tips</div>
                    </div>
                    <button className="follow-btn">Follow</button>
                  </div>
                  <div className="follow-item">
                    <div className="follow-avatar">TW</div>
                    <div className="follow-info">
                      <div className="follow-name">Tech Writer</div>
                      <div className="follow-desc">Technology insights</div>
                    </div>
                    <button className="follow-btn">Follow</button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;