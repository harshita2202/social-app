
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

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

    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleSubmit = async () => {

    if (!text.trim() && !image) {
      setError('Please add text or image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();

    if (text.trim()) {
      formData.append('text', text.trim());
    }

    if (image) {
      formData.append('image', image);
    }

    try {

      const res = await axios.post(
        `${API_URL}/api/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      onPostCreated(res.data);

      setText('');
      setImage(null);
      setImagePreview('');

      if (fileRef.current) {
        fileRef.current.value = '';
      }

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message ||
        'Failed to post'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-section">

      <div className="create-post-header">
        <h3>Create Post</h3>

        <div className="post-tabs">
          <button className="post-tab active">
            All Posts
          </button>

          <button className="post-tab">
            Promotions
          </button>
        </div>
      </div>

      {error && (
        <div
          className="error-msg"
          style={{ marginBottom: 10 }}
        >
          {error}
        </div>
      )}

      <textarea
        className="create-post-textarea"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />

      {imagePreview && (
        <div className="post-image-preview">

          <img
            src={imagePreview}
            alt="preview"
          />

          <button
            className="remove-image-btn"
            onClick={removeImage}
          >
            ✕
          </button>

        </div>
      )}

      <div className="create-post-actions">

        <div className="action-icons">

          <button
            className="action-icon-btn"
            onClick={() => fileRef.current.click()}
          >
            📷
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />

        </div>

        <button
          className="btn-post"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>

      </div>
    </div>
  );
}

