import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ListPage({ posts, setPosts }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [comments, setComments] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
        const response = await fetch('http://localhost:3000/post');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.reverse());
        } else {
          console.error(`오류: ${response.status}`);
        }  
    };
    fetchPosts();
  }, [setPosts]);

    useEffect(() => {
      const fetchComments = async () => {
        const response = await fetch('http://localhost:3000/comments');
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error(`오류: ${response.status}`);
        }
      };
      fetchComments();
    }, []);

  useEffect(() => {
    if (posts && posts.length > 0) {
      setFilteredPosts(posts);
    }
  }, [posts]);

  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (posts && posts.length > 0) {
      const results = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(keyword) ||
          post.body.toLowerCase().includes(keyword)
      );
      setFilteredPosts(results);
    }
  };

  const getCommentCount = (postId) => {
    return comments.filter(comment => comment.postId === postId).length;
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="검색어를 입력하세요"
        style={{ padding: '10px', width: '200px', marginRight: '5px' }}
      />
      <button onClick={handleSearch}>검색</button>
      <button onClick={() => navigate('/upload')}>새 글 작성</button>
      {filteredPosts && filteredPosts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>검색된 게시글이 없습니다.</p>
      ) : (
        filteredPosts
        .filter((post) => post && post.title) 
        .map((post) => (
          <div key={post.id} style={{ marginBottom: '20px' }}>
            <h2
              onClick={() => navigate(`/post/${post.id}`)}
              style={{ cursor: 'pointer' }}
            >
              {post.title}
            </h2>
            {post.hashTags && post.hashTags.length > 0 && (
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#f0f0f0',
                  padding: '5px 10px',
                  margin: '5px',
                  fontSize: '14px',
                }}
              >
                # {post.hashTags.join(' ,  # ')}
              </span>
            )}
            <h3>댓글 ({getCommentCount(post.id)})</h3>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}
