
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';

export default function Feed() {
  const { user, logout } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/api/posts`);

      // Remove invalid/broken posts
      const validPosts = res.data.filter(
        (post) =>
          post &&
          post.username &&
          post.createdAt
      );

      setPosts(validPosts);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (postId, updates) => {
    setPosts(prev =>
      prev.map(p =>
        p._id === postId
          ? { ...p, ...updates }
          : p
      )
    );
  };

  const filteredPosts = () => {
    let list = [...posts];

    if (search.trim()) {
      const q = search.toLowerCase();

      list = list.filter(
        p =>
          p.username?.toLowerCase().includes(q) ||
          p.text?.toLowerCase().includes(q)
      );
    }

    if (activeTab === 'most-liked') {
      list = list.sort(
        (a, b) =>
          (b.likes?.length || 0) -
          (a.likes?.length || 0)
      );

    } else if (activeTab === 'most-commented') {

      list = list.sort(
        (a, b) =>
          (b.comments?.length || 0) -
          (a.comments?.length || 0)
      );

    } else if (activeTab === 'for-you') {

      list = list.filter(
        p => p.username === user?.username
      );
    }

    return list;
  };

  return (
    <div>

      {/* Top Header */}
      <div className="top-header">

        <div className="header-logo">
          Social
        </div>

        <div className="header-right">

          <div className="header-points">
            <span>⭐</span>
            <span>50</span>
          </div>

          <div className="header-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

        </div>
      </div>

      {/* Search */}
      <div className="search-bar-wrapper">

        <div className="search-bar">

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>

          <input
            placeholder="Search promotions, users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

        </div>
      </div>

      <div className="app-layout">

        {/* Create Post */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Tabs */}
        <div className="feed-tabs">

          {[
            { id: 'all', label: 'All Post' },
            { id: 'for-you', label: 'For You' },
            { id: 'most-liked', label: 'Most Liked' },
            { id: 'most-commented', label: 'Most Commented' },
          ].map(tab => (

            <button
              key={tab.id}
              className={`feed-tab-btn ${
                activeTab === tab.id ? 'active' : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>

          ))}

        </div>

        {/* Posts */}
        {loading ? (

          <div className="loading-state">
            <div>Loading posts...</div>
          </div>

        ) : filteredPosts().length === 0 ? (

          <div className="empty-state">
            <div style={{ fontSize: 48 }}>
              📭
            </div>

            <p>
              No posts yet. Be the first to post!
            </p>
          </div>

        ) : (

          filteredPosts().map(post => (

            <PostCard
              key={post._id}
              post={post}
              onUpdate={handlePostUpdate}
            />

          ))

        )}

      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">

        <a href="/" className="nav-item active">

          <div className="nav-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>

          <span className="nav-label">
            Home
          </span>

        </a>

        <a href="/" className="nav-item">

          <div className="nav-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>

          <span className="nav-label">
            Tasks
          </span>

        </a>

        <a href="/" className="nav-item active">

          <div className="nav-social-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="white"
            >
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>

              <line
                x1="8.59"
                y1="13.51"
                x2="15.42"
                y2="17.49"
                stroke="white"
                strokeWidth="2"
              />

              <line
                x1="15.41"
                y1="6.51"
                x2="8.59"
                y2="10.49"
                stroke="white"
                strokeWidth="2"
              />
            </svg>
          </div>

          <span
            className="nav-label"
            style={{ color: 'white' }}
          >
            Social
          </span>

        </a>

        <a href="/" className="nav-item">

          <div className="nav-icon">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>

          <span className="nav-label">
            Leader Board
          </span>

        </a>

        <button
          className="logout-btn"
          onClick={logout}
        >

          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>

          Logout

        </button>

      </nav>
    </div>
  );
}
