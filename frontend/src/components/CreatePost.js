import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function CreatePost({ onPostCreated }) {
  const { token } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Please add text or an image.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    if (text.trim()) formData.append('text', text.trim());
    if (image) formData.append('image', image);

    try {
      const res = await axios.post('/api/posts', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setText('');
      setImage(null);
      setImagePreview('');
      if (fileRef.current) fileRef.current.value = '';
      onPostCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-section">
      <div className="create-post-header">
        <h3>Create Post</h3>
        <div className="post-tabs">
          <button className="post-tab active">All Posts</button>
          <button className="post-tab">Promotions</button>
        </div>
      </div>

      {error && <div className="error-msg" style={{ marginBottom: 10 }}>{error}</div>}

      <textarea
        className="create-post-textarea"
        placeholder="What's on your mind?"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
      />

      {imagePreview && (
        <div className="post-image-preview">
          <img src={imagePreview} alt="preview" />
          <button className="remove-image-btn" onClick={removeImage}>✕</button>
        </div>
      )}

      <div className="create-post-actions">
        <div className="action-icons">
          <button className="action-icon-btn" onClick={() => fileRef.current.click()} title="Add photo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
          <button className="action-icon-btn" title="Add emoji">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </button>
          <button className="action-icon-btn" title="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>

        <button className="btn-post" onClick={handleSubmit} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
