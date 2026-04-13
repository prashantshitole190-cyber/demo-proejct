import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Comments = ({ articleSlug }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [articleSlug]);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/comments/article/${articleSlug}/`);
      setComments(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setLoading(true);
    try {
      const response = await api.post(`/comments/article/${articleSlug}/`, {
        content: newComment,
        parent: replyTo
      });
      
      setNewComment('');
      setReplyTo(null);
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const CommentItem = ({ comment, isReply = false }) => (
    <div className={`comment-item ${isReply ? 'comment-reply' : ''}`}>
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">
            {comment.author?.first_name 
              ? comment.author.first_name[0].toUpperCase()
              : comment.author?.email[0].toUpperCase()
            }
          </div>
          <div className="author-info">
            <span className="author-name">
              {comment.author?.first_name && comment.author?.last_name
                ? `${comment.author.first_name} ${comment.author.last_name}`
                : comment.author?.username
              }
            </span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
        </div>
      </div>
      
      <div className="comment-content">
        <p>{comment.content}</p>
      </div>
      
      <div className="comment-actions">
        {user && !isReply && (
          <button 
            onClick={() => setReplyTo(comment.id)}
            className="reply-btn"
          >
            Reply
          </button>
        )}
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
      
      {replyTo === comment.id && (
        <div className="reply-form">
          <form onSubmit={handleSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              className="comment-textarea"
              rows="3"
            />
            <div className="reply-actions">
              <button 
                type="button" 
                onClick={() => {setReplyTo(null); setNewComment('');}}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading || !newComment.trim()}
              >
                {loading ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  return (
    <div className="comments-section">
      <h3 className="comments-title">
        Comments ({comments.length})
      </h3>
      
      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-input-wrapper">
            <div className="comment-avatar">
              {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="comment-textarea"
              rows="4"
            />
          </div>
          <div className="comment-form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || !newComment.trim()}
            >
              {loading ? 'Posting...' : 'Respond'}
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-login-prompt">
          <p>Please sign in to leave a comment.</p>
        </div>
      )}
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;