import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// JSON서버에서 가져옵니다.
const url = 'http://localhost:3000/post';

export default function UploadPage({ posts, setPosts }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [inputHashTag, setInputHashTag] = useState('');
  const [hashTags, setHashTags] = useState([]);

  const navigate = useNavigate(); 
 
  useEffect(() => {
    (async () => {
      if (posts.length === 0) {
        const response = await axios.get(url);
        setPosts(response.data);
      }
    })();
  }, [posts, setPosts]);

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
    navigate(`/post/${newId}`); 
  };

  const changeHashTagInput = (e) => setInputHashTag(e.target.value);

  // 엔터 해시태그 입력
  const addHashTag = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && inputHashTag.trim()) {
      e.preventDefault();
      if (hashTags.length < 5 && !hashTags.includes(inputHashTag.trim())) {
        setHashTags([...hashTags, inputHashTag.trim()]);
        setInputHashTag(''); 
      }
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === ' ' && !inputHashTag.trim()) {
      e.preventDefault();
    }
  };

  // 삭제
  const removeHashTag = (tagToRemove) => {
    setHashTags(hashTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
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
          .input-field {
            width: 50%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
          }
          .hash-tags {
            margin-bottom: 10px;
          }
          .hash-tag {
            display: inline-block;
            padding: 5px 10px;
            margin: 5px;
            background: #f0f0f0;
            font-size: 14px;
          }
          .remove-tag {
            margin-left: 5px;
            cursor: pointer;
            color: #999;
          }
          .submit-button {
            padding: 10px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}
