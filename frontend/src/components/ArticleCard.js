import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  return (
    <div className="article-card">
      {article.cover_image && (
        <img src={article.cover_image} alt={article.title} className="article-image" />
      )}
      <div className="article-content">
        <h2 className="article-title">
          <Link to={`/article/${article.slug}`}>{article.title}</Link>
        </h2>
        {article.subtitle && (
          <p className="article-subtitle">{article.subtitle}</p>
        )}
        <div className="article-meta">
          <Link to={`/profile/${article.author.username}`} className="author-link">
            {article.author.first_name} {article.author.last_name}
          </Link>
          <span className="reading-time">{article.reading_time} min read</span>
          <span className="claps">{article.claps_count} claps</span>
        </div>
        <div className="article-tags">
          {article.tags.map(tag => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;