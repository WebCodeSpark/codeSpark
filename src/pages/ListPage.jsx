import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListPage({ posts, setPosts }) {
  const navigate = useNavigate();

   // Fetch initial posts from API if `posts` is not defined or empty
   useEffect(() => {
    (async () => {
      if (!posts || posts.length === 0) {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data.slice(0, 3).reverse()); // 3개만
      }
    })();
  }, [posts, setPosts]);

  // Check if posts is undefined or null
  if (!posts) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
        로딩 중입니다...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={() => navigate('/upload')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        새 글 작성
      </button>
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{post.title}</h2>
            <p style={{ fontSize: '1rem', marginBottom: '10px' }}>{post.body}</p>
            {post.hashTags && post.hashTags.length > 0 && (
                <div>
                <span style={{
                  display: 'inline-block',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  padding: '5px 10px',
                  margin: '5px',
                  borderRadius: '15px',
                  fontSize: '14px',
                }}>
                  # {post.hashTags.join(' , # ')}
                </span>
                </div>
              )}

            <button
              onClick={() => navigate(`/post/${post.id}`)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              자세히 보기
            </button>
          </div>
        ))
      )}
    </div>
  );
}
