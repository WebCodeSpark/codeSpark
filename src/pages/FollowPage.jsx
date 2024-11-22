import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/todos';

export default function FollowPage() {
  const [users, setUsers] = useState([]);
  const [followers, setFollowers] = useState(new Set()); 

  useEffect(() => {
    (async () => {
      const response = await axios.get(url);
      setUsers(response.data.slice(0, 10).map((user) => ({
        id: user.id,
        title: user.title,
        followed: false, // 초기 팔로우 상태
      })));
    })();
  }, []);

  const toggleFollow = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, followed: !user.followed } : user 
      )
    );

    setFollowers((prev) => {
      const newFollowers = new Set(prev);
      if (newFollowers.has(id)) {
        newFollowers.delete(id);
      } else {
        newFollowers.add(id);
      }
      return newFollowers;
    });
  };

  return (
    <div>
      <div>팔로잉: {followers.size}</div>
      {users.map((user) => (
        <button key={user.id} onClick={() => toggleFollow(user.id)}>
          {user.followed ? '언팔로우' : '팔로우'}
        </button>
      ))}
    </div>
  );
}
