import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { chat, dalle } from './openai';

const url = 'http://localhost:3000/post';

export default function UploadPage({ posts, setPosts }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [inputHashTag, setInputHashTag] = useState('');
  const [hashTags, setHashTags] = useState([]); // 개별 태그
  const [recommendedTags, setRecommendedTags] = useState([]); // 추천 해시태그
  const [text, setText] = useState('');
  const [result, setReult] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();

  const makeImage = () => {
    const prompt = `다음문장을 영어로 번역해주세요${text}`;
    chat(prompt, (result) => {
      dalle(
        result,
        (images) => {
          console.log(images);
          setReult(images);
        },
        3
      );
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setBody(value);
    setText(value);
  };

  const fetchRecommendedTags = () => {
    if (!body.trim()) return;
    const prompt = `다음 글을 바탕으로 적절한 해시태그 5개를 추천해주세요: ${body}`;
    chat(prompt, (result) => {
      const tags = result
        .split(/[ ,#]/) // 공백, 쉼표, 또는 #로 구분
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0) // 빈 문자열 제거
        .slice(0, 5); // 최대 5개
      setRecommendedTags(tags);
    });
  };

  useEffect(() => {
    (async () => {
      if (posts.length === 0) {
        const response = await axios.get(url);
        setPosts(response.data);
      }
    })();
  }, [posts, setPosts]);

  const onAdd = async (title, body) => {
    const newId = posts.length > 0 ? Math.max(...posts.map((post) => post.id)) + 1 : 1;
    const newPost = {
      id: String(newId),
      title,
      body,
      hashTags,
      userId: 1,
      img: selectedImage,
    };
    const response = await axios.post('http://localhost:3000/post', newPost);
    setPosts((prevPosts) => [response.data, ...prevPosts]);
    setTitle('');
    setBody('');
    setHashTags([]);
    setSelectedImage('');
    navigate(`/post/${newId}`);
  };

  const changeHashTagInput = (e) => setInputHashTag(e.target.value);
  const addHashTag = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && inputHashTag.trim()) {
      e.preventDefault();
      if (hashTags.length < 5 && !hashTags.includes(inputHashTag.trim())) {
        setHashTags([...hashTags, inputHashTag.trim()]);
        setInputHashTag('');
      }
    }
  };

  const addRecommendedTag = (tag) => {
    if (hashTags.length < 5 && !hashTags.includes(tag)) {
      setHashTags([...hashTags, tag]);
    }
  };

  const removeHashTag = (tagToRemove) => {
    setHashTags(hashTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div style={{ width: '70%', maxWidth: '1200px', margin: '0 auto' }}>
      <button onClick={() => navigate('/list')} style={{ padding: '9px', marginRight: '20px', cursor: 'pointer' }}>
        목록
      </button>
      <br /><br />
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        placeholder="제목을 입력하세요"
        className="input-field"
      />
      <textarea
        onChange={handleChange}
        value={body}
        placeholder="내용을 입력하세요"
        rows="5"
        className="input-field"
      />
      <br/>
      <button onClick={fetchRecommendedTags} style={{ marginBottom: '10px' }}>
        해시태그 추천
      </button>
      <div className="recommended-tags">
        {recommendedTags.map((tag, index) => (
          <span key={index} className="recommended-tag" onClick={() => addRecommendedTag(tag)}>
            #{tag}
          </span>
        ))}
      </div>
      <input
        value={inputHashTag}
        onChange={changeHashTagInput}
        onKeyUp={addHashTag}
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
      <br />
      <button onClick={makeImage}> 이미지 생성</button>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
        {result.map((image, index) => (
          <img
            key={index}
            src={image.url}
            style={{
              width: 128,
              height: 128,
              border: selectedImage === image.url ? '3px solid blue' : '1px solid gray',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedImage(image.url)}
            alt={`Generated ${index}`}
          />
        ))}
      </div>
      <button
        onClick={() => {
          if (title && body) onAdd(title, body);
        }}
        className="submit-button"
      > 글 작성</button>
      <style>
        {`
          .input-field {
            width: 50%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
          }
          .recommended-tags {
            margin-bottom: 10px;
          }
          .recommended-tag {
            display: inline-block;
            padding: 5px 10px;
            margin: 5px;
            background: #e0f7fa;
            font-size: 14px;
            cursor: pointer;
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
