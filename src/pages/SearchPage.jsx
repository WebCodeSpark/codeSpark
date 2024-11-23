import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/posts'; // 게시글 CRUD API의 URL

export default function SearchPage() {
  const [posts, setPosts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색어 상태
  const [filteredPosts, setFilteredPosts] = useState([]); // 검색 결과 상태

  // 컴포넌트가 마운트될 때 게시글 목록을 가져오기
  useEffect(() => {
    (async () => {
      const response = await axios.get(url);
      setPosts(response.data); // 게시글 목록을 상태로 설정
      setFilteredPosts(response.data); // 검색 결과 초기화
    })();
  }, []);

  // 검색 기능
  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase(); // 검색어 처리
    const results = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(keyword) ||
        post.body.toLowerCase().includes(keyword)
    );
    setFilteredPosts(results); // 검색 결과를 상태로 업데이트
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>

      {/* 검색 */}
      <div
        style={{
          display: 'flex', // Flexbox를 사용하여 한 줄에 배치
          alignItems: 'center', // 세로 정렬 중앙 정렬
          gap: '10px', // 요소 간 간격
          marginBottom: '20px',
        }}
      >
        <input
          type="text"
          onChange={(e) => setSearchKeyword(e.target.value)}
          value={searchKeyword}
          placeholder="검색어를 입력하세요"
          style={{
            flex: '1', // 입력창이 남는 공간을 채우도록 설정
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={handleSearch} // 검색 버튼 클릭 시 검색 실행
          style={{
            padding: '10px 20px', // 버튼의 좌우 패딩 조정
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

      {/* 게시글 목록 출력 */}
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
            <h2
              style={{
                fontSize: '1.2rem',
                marginBottom: '10px',
              }}
            >
              {post.title}
            </h2>
            <p
              style={{
                fontSize: '1rem',
                marginBottom: '10px',
              }}
            >
              {post.body}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
