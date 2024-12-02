import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('데이터를 가져오지 못했습니다.');
        }
        const users = await response.json();
        const user = users[0]; // 첫 번째 사용자 데이터
        setUserInfo({
          username: user.username,
          following: Math.floor(Math.random() * 100), // 랜덤 데이터
          followers: Math.floor(Math.random() * 100), // 랜덤 데이터
          posts: [
            'React로 프로필 페이지를 만들어보세요!',
            '컴포넌트 스타일링은 중요합니다.',
            'JSONPlaceholder에서 데이터를 가져왔어요.',
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>에러 발생: {error}</p>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{userInfo.username}님이  작성한 글</h3>
        {userInfo.posts.length > 0 ? (
          <div style={{ display: 'grid', gap: '15px' }}>
            {userInfo.posts.map((post, index) => (
              <div
                key={index}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <p style={{ margin: 0 }}>{post}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>작성한 글이 없습니다.</p>
        )}
      </div>
  );
}
