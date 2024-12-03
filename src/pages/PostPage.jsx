import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const commonStyle = {
  hashtag: {
    display: 'inline-block',
    backgroundColor: '#f0f0f0',
    padding: '8px',
    margin: '5px',
  },
  hashtagDelete: {
    marginLeft: '5px',
    color: '#999',
    cursor: 'pointer',
  },
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
          style={{width:'50%'}}
        />
        <p>내용</p>
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          rows="5"
          style={{width:'50%'}}
        />
        <br/>
        <input
          value={newInputHashTag}
          onChange={changeHashTagInput}
          onKeyDown={addHashTag} // Enter 키로 해시태그 추가
          onKeyUp={keyDownHandler} // 빈 공백 방지
          placeholder="#해시태그를 등록해보세요. (최대 5개)"
          style={{width:'50%'}}
        />
        <br/>

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
        <br/><br/>
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
}

export default function PostPage({ posts, setPosts }) {
  const { postId } = useParams(); // URL의 :postId를 가져옴
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [post, setPost] = useState(null);

   // 댓글 관련 상태 추가
   const [comments, setComments] = useState({}); // 각 게시글 댓글
   const [commentInput, setCommentInput] = useState(''); // 댓글 입력 상태
   const [editingComment, setEditingComment] = useState(null); // 댓글 수정 상태
   

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`http://localhost:3000/post/${postId}`);
        if (postResponse.status === 200) {
          setPost(postResponse.data);
        }
        await fetchComments(); // 댓글 가져오기 호출
      } catch (error) {
        console.error('Error fetching post or comments:', error);
      }
    };
    fetchPostAndComments();
  }, [postId]);

  
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/comments?postId=${postId}`);
      if (response.status === 200) {
        setComments(response.data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  

  if (!post) {
    return <div>게시글을 불러오는 중입니다...</div>;
  }

  const onDelete = async () => {
    try {
      // 1. 해당 글에 관련된 댓글 삭제
      const commentsResponse = await axios.get(`http://localhost:3000/comments?postId=${post.id}`);
      
      if (commentsResponse.status === 200) {
        // 댓글이 있을 경우, 모든 댓글 삭제 요청
        const deleteCommentsPromises = commentsResponse.data.map((comment) => 
          axios.delete(`http://localhost:3000/comments/${comment.id}`)
        );
        
        // 댓글 삭제가 모두 완료될 때까지 기다리기
        await Promise.all(deleteCommentsPromises);
      }
  
      // 2. 글 삭제
      await axios.delete(`http://localhost:3000/post/${post.id}`);
      setPosts(posts.filter((p) => p.id !== post.id));
      navigate('/list'); // 글 목록으로 이동
  
    } catch (error) {
      console.error('Error deleting post and comments:', error);
    }
  };
  

  const onUpdate = async (title, body, hashTags) => {
    const updatedPost = {
      ...post,
      title,
      body,
      hashTags,
    };
  
    try {
      await axios.put(`http://localhost:3000/post/${post.id}`, updatedPost);
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? updatedPost
            : p
        )
      );
      setPost(updatedPost);
      setIsEditing(false); // 수정 완료 후 수정 모드 종료
    } catch (error) {
      console.error('안돼!!!:', error);
    }
  };

  const onAddComment = async (commentText) => {
    if (commentText.trim() === '') return;
  
    const newComment = {
      text: commentText,
      userId: "2", // 예시 사용자 ID
      postId: postId, // 현재 게시글 ID를 포함
    };
  
    try {
      const response = await axios.post(`http://localhost:3000/comments`, newComment);
      if (response.status === 201) {
        // 댓글을 해당 게시글에 추가
        setComments((prevComments) => {
          const updatedComments = [...prevComments, response.data];
          return updatedComments; // 댓글을 추가하여 상태 업데이트
        });
        setCommentInput(''); // 입력창 초기화
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  
  const onDeleteComment = async (commentId) => {
    try {
      // 댓글 삭제 요청
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      
      // 댓글 삭제 후 바로 상태 업데이트
      setComments((prevComments) => 
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  

  const onSubmitEditComment = async () => {
    if (!editingComment || editingComment.text.trim() === '') return; // 빈 댓글 방지
  
    try {
      // 댓글 수정 요청
      const response = await axios.put(
        `http://localhost:3000/comments/${editingComment.id}`,
        { text: editingComment.text } // 수정된 텍스트를 전송
      );
  
      if (response.status === 200) {
        // 수정된 댓글을 상태에서 바로 업데이트
        setComments((prevComments) => 
          prevComments.map((comment) =>
            comment.id === editingComment.id
              ? { ...comment, text: editingComment.text }
              : comment
          )
        );
        setEditingComment(null); // 수정 모드 종료
      }
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };
  
  
  return (
    <div>
      {isEditing ? (
        <Update title={post.title} body={post.body} hashTags={post.hashTags} onUpdate={onUpdate} />
      ) : (
        <>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
          
          {post.hashTags && post.hashTags.length > 0 ? (
            <div>
              {post.hashTags.map((tag, index) => (
                <span key={index} style={commonStyle.hashtag}>
                  #{tag}
                </span>
              ))}
            </div>
          ) : (
            <p>해시태그가 없습니다.</p>
          )}
           <br/>
          <button onClick={() => setIsEditing(true)}>수정</button>
          <button onClick={onDelete}>삭제</button>
          <button onClick={() => navigate('/list')}>목록</button>
        </>
      )}

      <h3>댓글</h3>
      {/* {comments[post.id] && comments[post.id].length > 0 ? ( */}
      {comments.length > 0 ? (
        <ul>
          {/* {comments[post.id].map((comment) => ( */}
          {comments.map((comment) => (
            <li key={comment.id}>
              {editingComment && editingComment.id === comment.id ? (
                <div>
                  <input
                    type="text"
                    value={editingComment.text}
                    style={{width:'50%'}}
                    onChange={(e) =>
                      setEditingComment({ ...editingComment, text: e.target.value })
                    }
                  />
                  <button onClick={onSubmitEditComment}>확인</button>
                </div>
              ) : (
                <>
                  {comment.text}
                  <button onClick={() => onDeleteComment(comment.id)}>삭제</button>
                  {/* <button onClick={() => onEditComment(comment.id, comment.text)}>수정</button> */}
                  <button onClick={() => setEditingComment(comment)}>수정</button>
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
        style={{width:'50%'}}
      />
     <button onClick={() => onAddComment(commentInput)}>댓글 작성</button>
    </div>
  );
}
