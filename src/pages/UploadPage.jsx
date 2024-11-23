import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// The URL for fetching posts from JSONPlaceholder API
const url = 'https://jsonplaceholder.typicode.com/posts';

export default function UploadPage({ posts, setPosts }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // Fetch posts on mount
  useEffect(() => {
    (async () => {
      if (posts.length === 0) {
        const response = await axios.get(url);
        setPosts(response.data); // 초기 posts 설정
      }
    })();
  }, [posts, setPosts]);

  // Add new post
  const onAdd = (title, body) => {
    const newId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 101;
    const newPost = {
      id: newId,
      title,
      body,
      userId: 1,
    };
    setPosts([...posts, newPost]); // 새로운 글 추가
    setTitle('');
    setBody('');
    navigate(`/post/${newId}`); // 작성 후 상세 페이지로 이동
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>새 글 작성</h1>

      {/* Add post */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          placeholder="제목을 입력하세요"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <textarea
          onChange={(e) => setBody(e.target.value)}
          value={body}
          placeholder="내용을 입력하세요"
          rows="5"
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        ></textarea>
        <button
          onClick={() => {
            if (title && body) {
              onAdd(title, body);
            }
          }}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          글 작성
        </button>
      </div>
    </div>
  );
}
