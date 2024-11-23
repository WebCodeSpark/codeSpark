import React from 'react';
import { Link } from 'react-router-dom'; // react-router-dom에서 Link 컴포넌트 불러오기

export default function Header() {
  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>CodeSpark</h1>
      <nav style={navStyle}>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <Link to="/main" style={linkStyle}>스파크</Link>
          </li>
          <li style={liStyle}>
            <Link to="/latest" style={linkStyle}>최신</Link>
          </li>
          <li style={liStyle}>
            <Link to="/my" style={linkStyle}>마이</Link>
          </li>
          <li style={liStyle}>
            <Link to="/profile" style={linkStyle}>프로필</Link>
          </li>
          <li style={liStyle}>
            <Link to="/calendar" style={linkStyle}>캘린더</Link>
          </li>
          <li style={liStyle}>
            <Link to="/follow" style={linkStyle}>팔로우</Link>
          </li>
          <li style={liStyle}>
            <Link to="/search" style={linkStyle}>검색</Link>
          </li>
          <li style={liStyle}>
            <Link to="/upload" style={linkStyle}>새 글 작성</Link>
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
};

const titleStyle = {
  fontSize: '36px',
};

const navStyle = {
  marginTop: '10px',
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
  fontSize: '18px',
};

