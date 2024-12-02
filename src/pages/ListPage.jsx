import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListPage({ posts, setPosts }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const navigate = useNavigate();

  useEffect(() => {
    // 처음에 게시글 데이터를 가져오는 로직
    (async () => {
      if (!posts || posts.length === 0) {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        setPosts(data.slice(0, 3).reverse()); // 3개만
      }
    })();
  }, [posts, setPosts]);

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

  if (!posts) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
        로딩 중입니다...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px'}}>
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={{
            padding: '10px',
            width: '200px',
            marginRight: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#3498db',
            color: 'white',
            margin:'3px',
            cursor: 'pointer',
          }}
        >
          검색
        </button>

      <button
        onClick={() => navigate('/upload')}
        style={{
          padding: '10px 20px',
          border: 'none',
          backgroundColor: '#2ecc71',
          color: 'white',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        새 글 작성
      </button>


      {filteredPosts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#777' }}>검색된 게시글이 없습니다.</p>
      ) : (
        filteredPosts.map((post) => (
          <div key={post.id} style={{ marginBottom: '20px' }}>

            <h2
              onClick={() => navigate(`/post/${post.id}`)}
              style={{
                cursor: 'pointer',
              }}
            >
              {post.title}
            </h2>
            <hr/>
            {post.hashTags && post.hashTags.length > 0 && (
              <div>
                <span>
                  # {post.hashTags.join(' , # ')}
                </span>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
