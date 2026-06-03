
import React, {
  useState,
  useEffect,
} from 'react';

import axios from 'axios';

import { useAuth }
from '../context/AuthContext';

import PostCard
from '../components/PostCard';

import CreatePost
from '../components/CreatePost';

const API_URL =
  process.env.REACT_APP_API_URL;

export default function Feed() {

  const { user, logout } =
    useAuth();

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState('all');

  const [search, setSearch] =
    useState('');



  // ================= FETCH POSTS =================

  const fetchPosts = async () => {

    setLoading(true);

    try {

      const res = await axios.get(
        `${API_URL}/api/posts`
      );

      setPosts(res.data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };



  useEffect(() => {

    fetchPosts();

  }, []);




  // ================= NEW POST =================

  const handlePostCreated =
    (newPost) => {

    setPosts(prev => [
      newPost,
      ...prev,
    ]);
  };




  // ================= UPDATE POST =================

  const handlePostUpdate =
    (postId, updates) => {

    setPosts(prev =>
      prev.map(post =>
        post._id === postId
          ? {
              ...post,
              ...updates,
            }
          : post
      )
    );
  };




  // ================= FILTER POSTS =================

  const filteredPosts = () => {

    let list = [...posts];

    if (search.trim()) {

      const q =
        search.toLowerCase();

      list = list.filter(
        p =>
          p.username
            ?.toLowerCase()
            .includes(q)
          ||
          p.text
            ?.toLowerCase()
            .includes(q)
      );
    }

    if (
      activeTab ===
      'most-liked'
    ) {

      list = list.sort(
        (a, b) =>
          (b.likes?.length || 0)
          -
          (a.likes?.length || 0)
      );

    } else if (
      activeTab ===
      'most-commented'
    ) {

      list = list.sort(
        (a, b) =>
          (b.comments?.length || 0)
          -
          (a.comments?.length || 0)
      );

    } else if (
      activeTab ===
      'for-you'
    ) {

      list = list.filter(
        p =>
          p.username ===
          user?.username
      );
    }

    return list;
  };




  return (

    <div>

      {/* HEADER */}

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

            {user?.username
              ?.charAt(0)
              .toUpperCase()}

          </div>

        </div>

      </div>




      {/* SEARCH */}

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
            <circle
              cx="11"
              cy="11"
              r="8"
            />

            <line
              x1="21"
              y1="21"
              x2="16.65"
              y2="16.65"
            />
          </svg>

          <input
            type="text"
            placeholder="Search users or posts..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>




      <div className="app-layout">

        {/* CREATE POST */}

        <CreatePost
          onPostCreated={
            handlePostCreated
          }
        />




        {/* FEED TABS */}

        <div className="feed-tabs">

          {[
            {
              id: 'all',
              label: 'All Posts',
            },

            {
              id: 'for-you',
              label: 'For You',
            },

            {
              id: 'most-liked',
              label: 'Most Liked',
            },

            {
              id: 'most-commented',
              label:
                'Most Commented',
            },

          ].map(tab => (

            <button
              key={tab.id}
              className={`feed-tab-btn ${
                activeTab === tab.id
                  ? 'active'
                  : ''
              }`}
              onClick={() =>
                setActiveTab(tab.id)
              }
            >
              {tab.label}
            </button>

          ))}

        </div>




        {/* POSTS */}

        {loading ? (

          <div className="loading-state">
            Loading posts...
          </div>

        ) : filteredPosts().length === 0 ? (

          <div className="empty-state">

            <div
              style={{
                fontSize: 48,
              }}
            >
              📭
            </div>

            <p>No posts yet.</p>

          </div>

        ) : (

          filteredPosts().map(post => (

            <PostCard
              key={post._id}
              post={post}
              onUpdate={
                handlePostUpdate
              }
            />

          ))
        )}

      </div>




      {/* BOTTOM NAVIGATION */}

      <nav className="bottom-nav">

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

              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>

          </div>

          <span className="nav-label">
            Tasks
          </span>

        </a>




        <a
          href="/"
          className="nav-item active"
        >

          <div className="nav-social-icon">

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <circle
                cx="18"
                cy="5"
                r="3"
              />

              <circle
                cx="6"
                cy="12"
                r="3"
              />

              <circle
                cx="18"
                cy="19"
                r="3"
              />

              <line
                x1="8.59"
                y1="13.51"
                x2="15.42"
                y2="17.49"
              />

              <line
                x1="15.41"
                y1="6.51"
                x2="8.59"
                y2="10.49"
              />
            </svg>

          </div>

          <span className="nav-label active">
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
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
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

  <div className="nav-icon">

    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>

      <polyline points="16 17 21 12 16 7"/>

      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>

  </div>

  <span className="nav-label">
    Logout
  </span>

</button>

      </nav>

    </div>
  );
}

