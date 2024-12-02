import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// The URL for fetching posts from JSONPlaceholder API
const url = 'https://jsonplaceholder.typicode.com/posts';

export default function UploadPage({ posts, setPosts }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [inputHashTag, setInputHashTag] = useState('');
  const [hashTags, setHashTags] = useState([]);

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
      hashTags,
      userId: 1,
    };
    setPosts([newPost, ...posts]); // 새로운 글 추가
    setTitle('');
    setBody('');
    setHashTags([]);
    navigate(`/post/${newId}`); // 작성 후 상세 페이지로 이동
  };

  const changeHashTagInput = (e) => setInputHashTag(e.target.value);

  // Add hashTag on Enter or Space key
  const addHashTag = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && inputHashTag.trim()) {
      e.preventDefault();
      if (hashTags.length < 5 && !hashTags.includes(inputHashTag.trim())) {
        setHashTags([...hashTags, inputHashTag.trim()]);
        setInputHashTag(''); // 입력창 초기화
      }
    }
  };

  // Prevent space from adding empty hashtags
  const keyDownHandler = (e) => {
    if (e.key === ' ' && !inputHashTag.trim()) {
      e.preventDefault();
    }
  };

  // Remove a hashTag
  const removeHashTag = (tagToRemove) => {
    setHashTags(hashTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="upload-page">
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        placeholder="제목을 입력하세요"
        className="input-field"
      />
      <textarea
        onChange={(e) => setBody(e.target.value)}
        value={body}
        placeholder="내용을 입력하세요"
        rows="5"
        className="input-field"
      ></textarea>

      <input
        value={inputHashTag}
        onChange={changeHashTagInput}
        onKeyUp={addHashTag}
        onKeyDown={keyDownHandler}
        placeholder="#해시태그를 등록해보세요. (최대 5개)"
        className="input-field"
      />

      <div className="hash-tags">
        {hashTags.map((tag, index) => (
          <span className="hash-tag" key={index}>
            {tag}{' '}
            <span className="remove-tag" onClick={() => removeHashTag(tag)}>
              &times;
            </span>
          </span>
        ))}
      </div>

      <button
        onClick={() => {
          if (title && body) onAdd(title, body);
        }}
        className="submit-button"
      >
        글 작성
      </button>

      <style>
        {`
          .upload-page {
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .input-field, .submit-button {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
          }
          .input-field {
            border: 1px solid #ccc;
          }
          .hash-tags {
            margin-bottom: 10px;
          }
          .hash-tag {
            display: inline-block;
            background: #f0f0f0;
            color: #333;
            padding: 5px 10px;
            margin: 5px;
            font-size: 14px;
          }
          .remove-tag {
            margin-left: 5px;
            color: #999;
            cursor: pointer;
          }
          .submit-button {
            background: #4caf50;
            color: #fff;
            border: none;
            cursor: pointer;
          }
          .submit-button:hover {
            background: #45a049;
          }
        `}
      </style>
    </div>
  );
}
