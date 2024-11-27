import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // react-router-dom에서 Link와 useHistory 불러오기

export default function Header() {

  const navigate = useNavigate(); // useNavigate로 변경
  const userEmail = localStorage.getItem('userEmail'); // 로컬 스토리지에서 이메일 가져오기
  const userName = localStorage.getItem('userName');
  const handleLogout = () => {
    // 로그아웃 시 로컬 스토리지에서 로그인 상태와 사용자 정보 삭제
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    alert('로그아웃 되었습니다.');
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };


  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>CodeSpark</h1>
      <nav style={navStyle}>
        <ul style={rightNavStyle}>
          <li style={liStyle}>
            <Link to="/search" style={buttonStyle}>검색</Link>
          </li>
          <li style={liStyle}>
            <Link to="/upload" style={buttonStyle}>새 글 작성</Link>
          </li>
            {userEmail ? (
            // 로그인된 상태일 때
            <li style={liStyle}>
              <span style={buttonStyle}>{userEmail}님</span>
            </li>
          ) : (
            // 로그인되지 않은 상태일 때
            <li style={liStyle}>
              <Link to="/login" style={buttonStyle}>로그인</Link>
            </li>
          )}
          {userEmail && (
            // 로그인된 사용자만 로그아웃 버튼을 표시
            <li style={liStyle}>
              <button onClick={handleLogout} style={buttonStyle}>로그아웃</button>
            </li>
          )}
        
        </ul>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <Link to="/list" style={linkStyle}>스파크</Link>
          </li>
          <li style={liStyle}>
            <Link to="/my" style={linkStyle}>피드</Link>
          </li>
          <li style={liStyle}>
            <Link to="/main" style={linkStyle}>하루</Link>
          </li>
          <li style={liStyle}>
            <Link to="/profile" style={linkStyle}>프로필</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

// 스타일링
const headerStyle = {
  backgroundColor: '#333',
  color: '#fff',
  padding: '10px 0',
  textAlign: 'center',
  position: 'relative',
};

const titleStyle = {
  fontSize: '32px',
};

const navStyle = {
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const rightNavStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  listStyleType: 'none',
  display: 'flex',
  gap: '20px',
  padding: '0',
};

const ulStyle = {
  listStyleType: 'none',
  display: 'flex',
  justifyContent: 'center',
  padding: '0',
};

const liStyle = {
  margin: '0 15px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '16px',
};

const buttonStyle = {
  display: 'inline-block',
  padding: '8px 16px', // padding 크기 줄여서 버튼 크기 감소
  backgroundColor: '#fff', // 흰색 배경
  color: '#333', // 검정색 글씨
  textDecoration: 'none',
  fontSize: '14px', // 글자 크기 줄임
  borderRadius: '5px',
  border: '1px solid #ccc',
  transition: 'background-color 0.3s ease, color 0.3s ease',
};

const buttonHoverStyle = {
  backgroundColor: '#333', // 검정 배경
  color: '#fff', // 흰색 글씨
};
