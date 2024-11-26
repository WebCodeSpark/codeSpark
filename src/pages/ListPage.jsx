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
        setPosts(data.slice(0, 10)); // 데이터의 첫 10개만 설정
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
      <h1 style={{ textAlign: 'center' }}>코드스파크 목록</h1>
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
