import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/users';

export default function FollowPage() {
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState(new Set()); // 팔로우 상태를 관리할 Set

  useEffect(() => {
    (async () => {
      const response = await axios.get(url);
      // 초기 사용자 데이터에 followerCount 추가
      const usersWithFollowerCount = response.data.slice(0, 10).map((user) => ({
        ...user,
        followerCount: Math.floor(Math.random() * 100), // 랜덤 초기값 (0~99)
      }));
      setUsers(usersWithFollowerCount);
    })();
  }, []);

  const toggleFollow = (id) => {
    setFollowers((prev) => {
      const newFollowers = new Set(prev);
      const updatedUsers = users.map((user) => {
        if (user.id === id) {
          if (newFollowers.has(id)) {
            // 언팔로우: 팔로워 수 감소
            newFollowers.delete(id);
            return { ...user, followerCount: user.followerCount - 1 };
          } else {
            // 팔로우: 팔로워 수 증가
            newFollowers.add(id);
            return { ...user, followerCount: user.followerCount + 1 };
          }
        }
        return user;
      });
      setUsers(updatedUsers);
      return newFollowers;
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>팔로우/팔로워 관리</h1>
      <div style={{ marginTop: '10px', fontSize: '18px', fontWeight: 'bold', color: '#444' }}>
        현재 팔로잉 수: {followers.size}
      </div>
      <div style={{ marginTop: '20px' }}>
        {users.map((user) => (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9',
              borderRadius: '5px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: '#333' }}>{user.name}</h3>
              <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
              <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
                Followers: {user.followerCount}
              </p>
            </div>
            <button
              onClick={() => toggleFollow(user.id)}
              style={{
                backgroundColor: followers.has(user.id) ? '#ff4d4f' : '#1890ff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '16px',
                textAlign: 'center',
              }}
            >
              {followers.has(user.id) ? '언팔로우' : '팔로우'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
