import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
      e.preventDefault();
      e.stopPropagation();
      if (newHashTags.length < 5 && !newHashTags.includes(newInputHashTag.trim())) {
        setNewHashTags([...newHashTags, newInputHashTag.trim()]);
        setNewInputHashTag('');
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
          event.preventDefault();
          onUpdate(newTitle, newBody, newHashTags);
        }}
      >

        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '50%' }}
        />

        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          rows="5"
          style={{ padding: '10px', marginBottom: '10px', width: '50%' }}
        />

        <input
          value={newInputHashTag}
          onChange={changeHashTagInput}
          onKeyDown={addHashTag}
          onKeyUp={keyDownHandler}
          placeholder="#해시태그를 등록해보세요. (최대 5개)"
          style={{ padding: '10px', marginBottom: '10px', width: '50%' }}
        />
        <br/> 
        
          {newHashTags.map((tag, index) => (
            <span key={index} style={{ display: 'inline-block', backgroundColor: '#f0f0f0', padding: '5px 10px', margin: '5px' }}>
              {tag}{' '}
              <span
                onClick={() => removeHashTag(tag)}
                style={{ marginLeft: '5px', color: '#999', cursor: 'pointer' }}
              >
                &times;
              </span>
            </span>
          ))}

        <br/> 
       
        <button
          type="submit"
          style={{ padding: '10px', margin: '5px', cursor: 'pointer', }}> 수정 완료 </button>
      </form>
    </div>
  );
}

export default function PostPage({ posts, setPosts }) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  // 댓글
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState('');
  const [editingComment, setEditingComment] = useState(null);

  const post = posts.find((p) => p.id === parseInt(postId));

  
  const onDelete = () => {
    setPosts(posts.filter((p) => p.id !== post.id));
    navigate('/list');
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
    setIsEditing(false);
  };

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

  const onDeleteComment = (commentId) => {
    const updatedComments = comments[post.id].filter(
      (comment) => comment.id !== commentId
    );
    setComments({
      ...comments,
      [post.id]: updatedComments,
    });
  };

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
    <div style={{ padding: '20px' }}>
      {isEditing ? (
        <Update title={post.title} body={post.body} hashTags={post.hashTags} onUpdate={onUpdate} />
      ) : (
        <>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
            {post.hashTags && post.hashTags.length > 0 ? (
              <div>
                {post.hashTags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f0f0f0',
                      padding: '5px 10px',
                      margin: '5px',
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

            <br />
            <button onClick={() => setIsEditing(true)}>수정</button>
            <button onClick={onDelete}>삭제</button>
            <br /><hr/><br />
            <button onClick={() => navigate('/list')}> 목록 </button>
        </>
      )}

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
                      style={{ padding: '10px', marginBottom: '10px', width: '50%' }}
                    />
                    <button onClick={onSubmitEditComment}>확인</button>
                  </div>
                ) : (
                  <>
                    {comment.text}
                    <button onClick={() => onEditComment(comment.id, comment.text)}>수정</button>
                    <button onClick={() => onDeleteComment(comment.id)}>삭제</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>댓글이 없습니다.</p>
        )}
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요"
            style={{ padding: '10px', marginBottom: '10px', width: '50%' }}
          />
          <button
            onClick={() => onAddComment(commentInput)}
            style={{ padding: '10px',margin: '5px',cursor: 'pointer', }} >댓글 작성
          </button>
      </div>
  );
}
