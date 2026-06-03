
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

    <div className="feed-page">

      <CreatePost
        onPostCreated={
          handlePostCreated
        }
      />

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

        <p>
          Loading posts...
        </p>

      ) : filteredPosts().length === 0 ? (

        <p>
          No posts yet.
        </p>

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
  );
}

