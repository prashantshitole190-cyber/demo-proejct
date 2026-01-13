import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [location.search]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/articles/search/?q=${encodeURIComponent(searchQuery)}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching articles:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories..."
            className="search-input"
            autoFocus
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loading">Searching...</div>
        ) : query && results.length === 0 ? (
          <div className="no-results">
            <h3>No results found</h3>
            <p>Try different keywords or check your spelling</p>
          </div>
        ) : (
          results.map(article => (
            <div key={article.id} className="search-result-item">
              <div className="result-content">
                <h3 
                  onClick={() => navigate(`/article/${article.slug}`)}
                  className="result-title"
                >
                  {article.title}
                </h3>
                <p className="result-excerpt">{article.excerpt}</p>
                <div className="result-meta">
                  <span className="result-author">By {article.author.username}</span>
                  <span className="result-date">
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                  <span className="result-stats">
                    {article.read_time} min read • {article.claps_count} claps
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Search;