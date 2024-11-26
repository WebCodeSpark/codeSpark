import React from 'react';
import { Link } from 'react-router-dom'; // react-router-dom에서 Link 컴포넌트 불러오기

export default function Header() {
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
