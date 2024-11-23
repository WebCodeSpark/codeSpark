import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Update({ title, body, onUpdate }) {
  const [newTitle, setNewTitle] = useState(title);
  const navigate = useNavigate();
  const [newBody, setNewBody] = useState(body);

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(newTitle, newBody); // Calls the passed onUpdate prop with new title and body
        }}
      >
        <p>제목</p>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <p>내용</p>
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          rows="5"
          style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          수정 완료
        </button>
      </form>
    </div>
  );
}

export default function PostPage({ posts, setPosts }) {
  const { postId } = useParams(); // URL의 :postId를 가져옴
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const post = posts.find((p) => p.id === parseInt(postId));

  if (!post) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        글을 찾을 수 없습니다.
      </div>
    );
  }

  const onDelete = () => {
    setPosts(posts.filter((p) => p.id !== post.id));
    navigate('/'); // 삭제 후 메인 페이지로 이동
  };

  const onUpdate = (title, body) => {
    setPosts(
      posts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              title,
              body,
            }
          : p
      )
    );
    setIsEditing(false); // 수정 완료 후 수정 모드 종료
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {isEditing ? (
        <Update title={post.title} body={post.body} onUpdate={onUpdate} />
      ) : (
        <>
          <h1>{post.id}</h1>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              수정
            </button>
            <button
              onClick={onDelete}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              삭제
            </button>
            <br/>
            <button 
            onClick={() => navigate('/latest')}
            style={{
                padding: '10px 20px',
                backgroundColor: 'gray',
                marginTop:'10px',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}>목록</button>
          </div>
        </>
      )}
    </div>
  );
}
