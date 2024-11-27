import React, { useState, useEffect } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState(''); // 이메일 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [error, setError] = useState(''); // 에러 메시지 상태
  const [users, setUsers] = useState([]); // 사용자 목록 상태

  // useEffect 훅을 사용하여 처음 로드될 때 사용자 정보를 가져옵니다.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data); // 사용자 데이터를 상태에 저장
      } catch (err) {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', err);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault(); // 폼 기본 동작 방지
    setError(''); // 에러 초기화

    // 이메일과 비밀번호가 일치하는지 확인
    const user = users.find((user) => user.email === email && password === '0000'); // 비밀번호는 고정값 '0000'

    if (user) {
      // 로그인 성공 시 localStorage에 로그인 상태 저장
      localStorage.setItem('isLoggedIn', 'true'); // 로그인 상태 저장
      localStorage.setItem('userEmail', email); // 이메일 저장
      alert('로그인 성공');
      window.location.href = '/home'; // 로그인 후 홈 페이지로 이동 (예시)
    } else {
      // 로그인 실패 시 에러 메시지 표시
      setError('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
        <h2>로그인</h2>
        {/* 이메일 입력 */}
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
        {/* 비밀번호 입력 */}
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
        {/* 에러 메시지 */}
        {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
        {/* 로그인 버튼 */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#333',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          로그인
        </button>
      </form>
    </div>
  );
}
