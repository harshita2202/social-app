import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function getAvatarColor(name) {
  const colors = [
    'linear-gradient(135deg,#2B6BE6,#6C4FE8)',
    'linear-gradient(135deg,#F5A623,#E8875A)',
    'linear-gradient(135deg,#27AE60,#1ABC9C)',
    'linear-gradient(135deg,#E74C3C,#C0392B)',
    'linear-gradient(135deg,#9B59B6,#8E44AD)',
    'linear-gradient(135deg,#2980B9,#3498DB)',
  ];
  const idx = (name?.charCodeAt(0) || 0) % colors.length;
  return colors[idx];
}

export default function PostCard({ post, onUpdate }) {
  const { user, token } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);

  const isLiked = post.likes?.includes(user?.username);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(post._id, { likes: res.data.likes });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await axios.post(
        `/api/posts/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(post._id, { comments: res.data.comments });
      setCommentText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-user-info">
          <div className="post-avatar" style={{ background: getAvatarColor(post.username) }}>
            {post.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="post-username">@{post.username}</div>
            <div className="post-time">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
      </div>

      {/* Text */}
      {post.text && <div className="post-text">{post.text}</div>}

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="post-image"
          style={{ cursor: 'pointer' }}
          onClick={() => setImgExpanded(!imgExpanded)}
        />
      )}

      {/* Likes list */}
      {post.likes?.length > 0 && (
        <div className="likes-list">
          ❤️ Liked by {post.likes.slice(0, 3).join(', ')}
          {post.likes.length > 3 && ` and ${post.likes.length - 3} others`}
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`post-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isLiked ? '#E74C3C' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {post.likes?.length || 0} Like{post.likes?.length !== 1 ? 's' : ''}
        </button>

        <button
          className="post-action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {post.comments?.length || 0} Comment{post.comments?.length !== 1 ? 's' : ''}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="comments-section">
          {post.comments?.map((c, i) => (
            <div key={i} className="comment-item">
              <div className="comment-avatar" style={{ background: getAvatarColor(c.username) }}>
                {c.username?.charAt(0).toUpperCase()}
              </div>
              <div className="comment-bubble">
                <div className="comment-username">@{c.username}</div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          ))}

          {post.comments?.length === 0 && (
            <div style={{ padding: '10px 0', color: '#9CA3AF', fontSize: '13px' }}>
              No comments yet. Be the first!
            </div>
          )}

          <form className="comment-input-row" onSubmit={handleComment}>
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              disabled={submitting}
            />
            <button type="submit" className="comment-submit-btn" disabled={submitting || !commentText.trim()}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
