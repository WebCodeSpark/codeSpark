import React, { useState, useEffect } from 'react';
import axios from 'axios';

// The URL for fetching posts from JSONPlaceholder API
const url = 'https://jsonplaceholder.typicode.com/posts';

function Update({ title, body, onUpdate }) {
  const [newTitle, setNewTitle] = useState(title);
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
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </p>
        <p>내용</p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={newBody}
            onChange={(event) => setNewBody(event.target.value)}
          ></textarea>
        </p>
        <p>
          <input type="submit" value="수정 완료" />
        </p>
      </form>
    </div>
  );
}

export default function LatestPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [editingPosts, setEditingPosts] = useState({});
  const [editingComment, setEditingComment] = useState({});

  // Fetch posts on mount
  useEffect(() => {
    (async () => {
      const response = await axios.get(url);
      setPosts(response.data); // Set posts to state
    })();
  }, []);

  // Add new post
  const onAdd = async (title, body) => {
    const newId = posts.length > 0 ? posts[posts.length - 1].id + 1 : 101;
    const newPost = {
      id: newId,
      title,
      body,
      userId: 1,
    };
    setPosts([...posts, newPost]);
    setTitle('');
    setBody('');
  };

  // Delete post
  const onDelete = async (id) => {
    await axios.delete(`${url}/${id}`);
    setPosts(posts.filter((post) => post.id !== id));

    // Delete associated comments
    const newComments = { ...comments };
    delete newComments[id];
    setComments(newComments);
  };

  // Update post
  const onUpdate = async (id, title, body) => {
    const updatedPost = { id, title, body };
    // Update the post on the server (for now, we're just updating locally)
    setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));

    // End editing mode
    setEditingPosts((prev) => {
      const { [id]: deleted, ...rest } = prev;
      return rest;
    });
  };

  // Handle editing post state
  const onEditPost = (post) => {
    setEditingPosts({
      ...editingPosts,
      [post.id]: { title: post.title, body: post.body },
    });
  };

  // Handle adding a comment
  const onAddComment = (postId, comment) => {
    if (comment.trim() === '') return;
    const postComments = comments[postId] || [];
    const newComment = {
      id: new Date().getTime(),
      text: comment,
    };
    setComments({
      ...comments,
      [postId]: [...postComments, newComment],
    });
    setCommentInput({ ...commentInput, [postId]: '' });
  };

  // Handle deleting a comment
  const onDeleteComment = (postId, commentId) => {
    const updatedComments = comments[postId].filter(
      (comment) => comment.id !== commentId
    );
    setComments({
      ...comments,
      [postId]: updatedComments,
    });
  };

    // 댓글 수정
// Handle editing a comment
  const onEditComment = (postId, commentId) => {
    setEditingComment({ postId, commentId });
  };

 // Submit the edited comment
 const onSubmitEditComment = (postId, commentId) => {
  const updatedComments = comments[postId].map((comment) =>
    comment.id === commentId
      ? { ...comment, text: editingComment.text }
      : comment
  );
  setComments({
    ...comments,
    [postId]: updatedComments,
  });
  setEditingComment({}); // Exit editing mode
};
    
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>커뮤니티</h1>

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
              setTitle('');
              setBody('');
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

      {/* Display posts */}
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#777' }}>게시글이 없습니다.</div>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '5px',
            }}
          >
            {editingPosts[post.id] ? (
              <Update
                title={editingPosts[post.id].title}
                body={editingPosts[post.id].body}
                onUpdate={(title, body) => onUpdate(post.id, title, body)}
              />
            ) : (
              <>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <div>
                  <button
                    onClick={() => onDelete(post.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => onEditPost(post)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f39c12',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                    }}
                  >
                    수정
                  </button>
                </div>
              </>
            )}

        
          
            {/* Comments */}
            <div style={{ marginTop: '10px' }}>
              <h3>댓글</h3>
              {comments[post.id] && comments[post.id].length > 0 ? (
                <ul>
                  {comments[post.id].map((comment) => (
                    <li key={comment.id} style={{ marginBottom: '10px' }}>
                      {editingComment.postId === post.id &&
                      editingComment.commentId === comment.id ? (
                        <div>
                          <input
                            type="text"
                            value={editingComment.text}
                            onChange={(e) =>
                              setEditingComment({
                                ...editingComment,
                                text: e.target.value,
                              })
                            }
                            style={{
                              padding: '5px',
                              borderRadius: '5px',
                              border: '1px solid #ccc',
                              marginRight: '5px',
                            }}
                          />
                          <button
                            onClick={() =>
                              onSubmitEditComment(post.id, comment.id)
                            }
                            style={{
                              padding: '5px',
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                            }}
                          >
                            확인
                          </button>
                        </div>
                      ) : (
                        <>
                          {comment.text}
                          <button
                            onClick={() => onDeleteComment(post.id, comment.id)}
                            style={{
                              padding: '5px',
                              backgroundColor: '#e74c3c',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              marginLeft: '5px',
                            }}
                          >
                            삭제
                          </button>
                          <button
                            onClick={() =>
                              onEditComment(post.id, comment.id, comment.text)
                            }
                            style={{
                              padding: '5px',
                              backgroundColor: '#f39c12',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              marginLeft: '5px',
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

              {/* Add comment */}
              <input
                type="text"
                value={commentInput[post.id] || ''}
                onChange={(e) =>
                  setCommentInput({ ...commentInput, [post.id]: e.target.value })
                }
                placeholder="댓글을 입력하세요"
                style={{
                  width: '80%',
                  padding: '5px',
                  marginRight: '5px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={() => onAddComment(post.id, commentInput[post.id])}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
              >
                댓글 작성
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}