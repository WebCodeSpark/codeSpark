import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ setLoggedInUser }) {
  const [userlist, setUserlist] = useState([]); // JSON 서버의 사용자 데이터
  const [email, setEmail] = useState(''); // 입력된 이메일
  const [password, setPassword] = useState(''); // 입력된 비밀번호
  const navigate = useNavigate();

  useEffect(() => {
    // JSON 서버에서 userlist 가져오기
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/userlist');
        const data = await response.json();
        setUserlist(data); // 데이터 상태로 저장
      } catch (error) {
        console.error('사용자 데이터를 불러오는 중 오류 발생:', error);
      }
    })();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    console.log('사용자 입력 이메일:', email);
    console.log('사용자 입력 비밀번호:', password);
    console.log('데이터베이스 사용자 목록:', userlist);

    // 이메일과 비밀번호가 일치하는 사용자 찾기
    const user = userlist.find((user) => user.email === email && user.password === password);

    if (user) {
      setLoggedInUser(user); // 로그인된 사용자 상태 업데이트
      alert(`${user.username}님, 로그인 성공`);
      navigate('/main');
    } else {
      alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
        <h2>로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            marginBottom: '10px',
            padding: '10px',
            width: '200px',
            display: 'block',
          }}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            marginBottom: '10px',
            padding: '10px',
            width: '200px',
            display: 'block',
          }}
          required
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#333',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
