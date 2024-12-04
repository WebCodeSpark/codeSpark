import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { chat, dalle } from './openai'; 

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

function Update({ title, body, hashTags, img, onUpdate }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newBody, setNewBody] = useState(body);
  const [newInputHashTag, setNewInputHashTag] = useState('');
  const [newHashTags, setNewHashTags] = useState(hashTags || []);
  const [newImg, setNewImg] = useState(img || '');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(img || '');

   // 이미지 생성 요청
   const generateImages = () => {
    const prompt = `다음 문장을 기반으로 이미지를 생성해주세요: ${newBody}`;
    chat(prompt, (result) => {
      dalle(result, (images) => {
        setGeneratedImages(images);
      }, 3);
    });
  };

  const changeHashTagInput = (e) => {
    setNewInputHashTag(e.target.value);
  };


  const addHashTag = (e) => {
    if (e.key === 'Enter' && newInputHashTag.trim()) {
      e.preventDefault(); // 폼 제출 방지
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
          onUpdate(newTitle, newBody, newHashTags, selectedImage || newImg);
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
          onKeyDown={addHashTag} 
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
        <button type="button" onClick={generateImages}>
          이미지 생성
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px',marginBottom:'10px' }}>
          {generatedImages.map((image, index) => (
            <img
              key={index}
              src={image.url}
              alt={`Generated ${index}`}
              style={{
                width: '128px',
                height: '128px',
                border: selectedImage === image.url ? '3px solid blue' : '1px solid gray',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedImage(image.url)}
            />
          ))}
        </div>
        <button type="submit" style={{ padding: '5px 8px', marginRight: '20px', cursor: 'pointer' }}>수정 완료</button>
      </form>
    </div>
  );
}

export default function PostPage({ posts, setPosts }) {
  const { postId } = useParams(); // URL의 :postId를 가져옴
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [post, setPost] = useState(null);
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
        console.error('오류:', error);
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
      console.error('오류:', error);
    }
  };
  if (!post) {
    return <div>게시글을 불러오는 중입니다...</div>;
  }
  const onDelete = async () => {
    try {
      const commentsResponse = await axios.get(`http://localhost:3000/comments?postId=${post.id}`);  
      if (commentsResponse.status === 200) {
        const deleteCommentsPromises = commentsResponse.data.map((comment) => 
          axios.delete(`http://localhost:3000/comments/${comment.id}`)
        );
        await Promise.all(deleteCommentsPromises);
      }
  
      await axios.delete(`http://localhost:3000/post/${post.id}`);
      setPosts(posts.filter((p) => p.id !== post.id));
      navigate('/list'); 
  
    } catch (error) {
      console.error('오류:', error);
    }
  };
  
  const onUpdate = async (title, body, hashTags,img) => {
    const updatedPost = {
      ...post,
      title,
      body,
      hashTags,
      img,
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
      console.error('오류:', error);
    }
  };

  const onAddComment = async (commentText) => {
    if (commentText.trim() === '') return;
  
    const newComment = {
      text: commentText,
      userId: "2",
      postId: postId, 
    };
  
    try {
      const response = await axios.post(`http://localhost:3000/comments`, newComment);
      if (response.status === 201) {
        setComments((prevComments) => {
          const updatedComments = [...prevComments, response.data];
          return updatedComments; // 댓글 추가
        });
        setCommentInput('');
      }
    } catch (error) {
      console.error('오류:', error);
    }
  };
  
  const onDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      setComments((prevComments) => 
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error('오류:', error);
    }
  };
  
  const onSubmitEditComment = async () => {
    if (!editingComment || editingComment.text.trim() === '') return; 
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
      console.error('오류:', error);
    }
  };
 
  return (
    <div style={{ width: '70%', maxWidth: '1200px', margin: '0 auto' }}>
      {isEditing ? (
          <Update title={post.title} body={post.body} hashTags={post.hashTags} onUpdate={onUpdate} />
        ) : (
          <>
            <button onClick={() => navigate('/list')}style={{ padding: '5px 8px', marginRight: '20px', cursor: 'pointer' }}>목록</button>
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

            {Array.isArray(post.img) && post.img.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {post.img.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Post image ${index + 1}`}
                    style={{ width: '150px', height: '150px', margin: '10px', objectFit: 'cover' }}
                  />
                ))}
              </div>
            ) : post.img ? (
              <img
                src={post.img}
                alt="Post image"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <p>이미지가 없습니다.</p>
            )}

            <br />
            <button onClick={() => setIsEditing(true)} style={{ padding:'5px 8px', marginRight:'5px',cursor: 'pointer' }}>수정</button>
            <button onClick={onDelete} style={{ padding: '5px 8px', marginRight: '20px', cursor: 'pointer' }}>삭제</button>
          </>
        )}

      <h3>댓글 ({comments.length})</h3>
      {comments.length > 0 ? (
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
          {comments.map((comment) => (
            <li key={comment.id}>
              {editingComment && editingComment.id === comment.id ? (
                <div>
                  <input
                    type="text"
                    value={editingComment.text}
                    style={{width:'50%',padding: '8px',marginRight: '10px'}}
                    onChange={(e) =>
                      setEditingComment({ ...editingComment, text: e.target.value })
                    }
                  />
                  <button onClick={onSubmitEditComment} style={{ padding: '5px 8px', marginRight: '20px', cursor: 'pointer' }}>확인</button>
                </div>
              ) : (
                <>
                  {comment.text}
                  <button onClick={() => setEditingComment(comment)} style={{ padding:'5px 8px', marginLeft: '20px', marginRight:'5px',cursor: 'pointer' }}>수정</button>
                  <button onClick={() => onDeleteComment(comment.id)} style={{ padding: '5px 8px', marginRight: '20px', cursor: 'pointer' }}>삭제</button>
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
        style={{width:'50%',padding: '8px',marginRight: '10px'}}
      />
     <button onClick={() => onAddComment(commentInput)} style={{ padding:'5px 8px', marginRight: '20px', cursor: 'pointer' }}>댓글 작성</button>
    </div>
  );
}