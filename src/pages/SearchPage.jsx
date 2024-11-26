import React, { useState, useEffect } from 'react';

export default function SearchPage({ posts }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  // 검색 기능
  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.body.toLowerCase().includes(keyword)
    );
    setFilteredPosts(results);
  };

  // posts 변경 시 검색 결과 초기화
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px',
        }}
      >
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={{
            flex: '1',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          검색
        </button>
      </div>
      {filteredPosts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#777' }}>
          검색된 게시글이 없습니다.
        </div>
      ) : (
        filteredPosts.map((post) => (
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
          </div>
        ))
      )}
    </div>
  );
}
