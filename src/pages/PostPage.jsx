import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 공통 스타일 객체
const commonStyle = {
  input: {
    width: '50%',
    padding: '10px',
    marginBottom: '10px',
  },
  textarea: {
    width: '50%',
    padding: '10px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    margin:'5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  hashtag: {
    display: 'inline-block',
    backgroundColor: '#f0f0f0',
    padding: '5px 10px',
    margin: '5px',
  },
  hashtagDelete: {
    marginLeft: '5px',
    color: '#999',
    cursor: 'pointer',
  }
};

function Update({ title, body, hashTags, onUpdate }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [newInputHashTag, setNewInputHashTag] = useState('');
  const [newHashTags, setNewHashTags] = useState(hashTags || []);

  const changeHashTagInput = (e) => {
    setNewInputHashTag(e.target.value);
  };

  const addHashTag = (e) => {
    if (e.key === 'Enter' && newInputHashTag.trim()) {
      e.preventDefault(); // 폼 제출 방지
      e.stopPropagation(); // 이벤트 전파 중단
      if (newHashTags.length < 5 && !newHashTags.includes(newInputHashTag.trim())) {
        setNewHashTags([...newHashTags, newInputHashTag.trim()]);
        setNewInputHashTag(''); // 입력창 초기화
      }
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === ' ' && !newInputHashTag.trim()) {
      e.preventDefault();
    }
  };

  const removeHashTag = (tagToRemove) => {
    setNewHashTags(newHashTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault(); // 기본 폼 제출 방지
          onUpdate(newTitle, newBody, newHashTags);
        }}
      >
        <p>제목</p>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={commonStyle.input}
        />
        <p>내용</p>
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          rows="5"
          style={commonStyle.textarea}
        />
        <input
          value={newInputHashTag}
          onChange={changeHashTagInput}
          onKeyDown={addHashTag} // Enter 키로 해시태그 추가
          onKeyUp={keyDownHandler} // 빈 공백 방지
          placeholder="#해시태그를 등록해보세요. (최대 5개)"
          style={commonStyle.input}
        />

        <div style={{ marginBottom: '10px' }}>
          {newHashTags.map((tag, index) => (
            <span key={index} style={commonStyle.hashtag}>
              {tag}{' '}
              <span
                onClick={() => removeHashTag(tag)}
                style={commonStyle.hashtagDelete}
              >
                &times;
              </span>
            </span>
          ))}
        </div>
        <button
          type="submit"
          style={{
            ...commonStyle.button,
            backgroundColor: '#4CAF50',
            color: 'white',
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

  // 댓글
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState('');
  const [editingComment, setEditingComment] = useState(null);

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

  const onUpdate = (title, body, hashTags) => {
    setPosts(
      posts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              title,
              body,
              hashTags,
            }
          : p
      )
    );
    setIsEditing(false); // 수정 완료 후 수정 모드 종료
  };

  // 댓글 추가
  const onAddComment = (comment) => {
    if (comment.trim() === '') return;
    const postComments = comments[post.id] || [];
    const newComment = {
      id: new Date().getTime(),
      text: comment,
    };
    setComments({
      ...comments,
      [post.id]: [...postComments, newComment],
    });
    setCommentInput('');
  };

  // 댓글 삭제
  const onDeleteComment = (commentId) => {
    const updatedComments = comments[post.id].filter(
      (comment) => comment.id !== commentId
    );
    setComments({
      ...comments,
      [post.id]: updatedComments,
    });
  };

  // 댓글 수정
  const onEditComment = (commentId, text) => {
    setEditingComment({ id: commentId, text });
  };

  const onSubmitEditComment = () => {
    const updatedComments = comments[post.id].map((comment) =>
      comment.id === editingComment.id
        ? { ...comment, text: editingComment.text }
        : comment
    );
    setComments({
      ...comments,
      [post.id]: updatedComments,
    });
    setEditingComment(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {isEditing ? (
        <Update title={post.title} body={post.body} hashTags={post.hashTags} onUpdate={onUpdate} />
      ) : (
        <>
          <h1>{post.title}</h1>
          <p>{post.body}</p>

          {/* 해시태그 표시 */}
          <div style={{ marginTop: '10px' }}>
            <h4>해시태그</h4>
            {post.hashTags && post.hashTags.length > 0 ? (
              <div>
                {post.hashTags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      ...commonStyle.hashtag,
                      fontSize: '14px',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p>해시태그가 없습니다.</p>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                ...commonStyle.button,
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              수정
            </button>
            <button
              onClick={onDelete}
              style={{
                ...commonStyle.button,
                backgroundColor: '#e74c3c',
                color: 'white',
              }}
            >
              삭제
            </button>
            <br />
            <br />
            <button
              onClick={() => navigate('/list')}
              style={{
                ...commonStyle.button,
                backgroundColor: '#2980b9',
                color: 'white',
              }}
            >
              목록
            </button>
          </div>
        </>
      )}

      {/* 댓글 섹션 */}
      <div style={{ marginTop: '30px' }}>
        <h3>댓글</h3>
        {comments[post.id] && comments[post.id].length > 0 ? (
          <ul>
            {comments[post.id].map((comment) => (
              <li key={comment.id} style={{ marginBottom: '10px' }}>
                {editingComment && editingComment.id === comment.id ? (
                  <div>
                    <input
                      type="text"
                      value={editingComment.text}
                      onChange={(e) =>
                        setEditingComment({ ...editingComment, text: e.target.value })
                      }
                      style={commonStyle.input}
                    />
                    <button
                      onClick={onSubmitEditComment}
                      style={{
                        ...commonStyle.button,
                        backgroundColor: '#f39c12',
                        color: 'white',
                      }}
                    >
                      확인
                    </button>
                  </div>
                ) : (
                  <>
                    {comment.text}
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      style={{
                        ...commonStyle.button,
                        backgroundColor: '#e74c3c',
                        color: 'white',
                      }}
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => onEditComment(comment.id, comment.text)}
                      style={{
                        ...commonStyle.button,
                        backgroundColor: '#3498db',
                        color: 'white',
                      }}
                    >
                      수정
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>댓글이 없습니다.</p>
        )}
        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요"
            style={commonStyle.input}
          />
          <button
            onClick={() => onAddComment(commentInput)}
            style={{
              ...commonStyle.button,
              backgroundColor: '#2ecc71',
              color: 'white',
            }}
          >
            댓글 작성
          </button>
        </div>
      </div>
    </div>
  );
}
