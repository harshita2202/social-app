
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

function timeAgo(dateStr) {

  if (!dateStr) return 'Just now';

  const diff = (Date.now() - new Date(dateStr)) / 1000;

  if (diff < 60) return 'just now';

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  }

  const d = new Date(dateStr);

  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
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

  const idx =
    (name?.charCodeAt(0) || 0) % colors.length;

  return colors[idx];
}

export default function PostCard({
  post,
  onUpdate,
}) {

  const { user, token } = useAuth();

  const [showComments, setShowComments] =
    useState(false);

  const [commentText, setCommentText] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const isLiked =
    post.likes?.includes(user?.username);

  const handleLike = async () => {

    try {

      const res = await axios.post(
        `${API_URL}/api/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(post._id, {
        likes: res.data.likes,
      });

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
        `${API_URL}/api/posts/${post._id}/comment`,
        {
          text: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(post._id, {
        comments: res.data.comments,
      });

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

          <div
            className="post-avatar"
            style={{
              background: getAvatarColor(
                post.username
              ),
            }}
          >
            {post.username
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <div className="post-username">
              @{post.username}
            </div>

            <div className="post-time">
              {timeAgo(post.createdAt)}
            </div>

          </div>
        </div>
      </div>

      {/* Text */}
      {post.text && (
        <div className="post-text">
          {post.text}
        </div>
      )}

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="post"
          className="post-image"
        />
      )}

      {/* Likes */}
      {post.likes?.length > 0 && (
        <div className="likes-list">

          ❤️ Liked by{' '}

          {post.likes
            .slice(0, 3)
            .join(', ')}

          {post.likes.length > 3 &&
            ` and ${
              post.likes.length - 3
            } others`}

        </div>
      )}

      {/* Actions */}
      <div className="post-actions">

        <button
          className={`post-action-btn ${
            isLiked ? 'liked' : ''
          }`}
          onClick={handleLike}
        >
          ❤️ {post.likes?.length || 0} Likes
        </button>

        <button
          className="post-action-btn"
          onClick={() =>
            setShowComments(!showComments)
          }
        >
          💬{' '}
          {post.comments?.length || 0}{' '}
          Comments
        </button>

      </div>

      {/* Comments */}
      {showComments && (

        <div className="comments-section">

          {post.comments?.map((c, i) => (

            <div
              key={i}
              className="comment-item"
            >

              <div
                className="comment-avatar"
                style={{
                  background:
                    getAvatarColor(
                      c.username
                    ),
                }}
              >
                {c.username
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="comment-bubble">

                <div className="comment-username">
                  @{c.username}
                </div>

                <div className="comment-text">
                  {c.text}
                </div>

              </div>
            </div>
          ))}

          <form
            className="comment-input-row"
            onSubmit={handleComment}
          >

            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) =>
                setCommentText(
                  e.target.value
                )
              }
              disabled={submitting}
            />

            <button
              type="submit"
              className="comment-submit-btn"
              disabled={
                submitting ||
                !commentText.trim()
              }
            >
              Send
            </button>

          </form>

        </div>
      )}
    </div>
  );
}

