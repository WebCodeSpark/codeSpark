import React from 'react';
import { Link } from 'react-router-dom';
import Weather from '../pages/WeatherPage';

export default function Header({ userName, onLogout }) {
  return (
    <header style={{ textAlign: 'center', margin: '0 auto', width: '100%' }}>
      <h1 className="centered-title">
        <Link to="/list" style={{ textDecoration: 'none', color: 'inherit' }}>
          CodeSpark
        </Link>
      </h1>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: '0 auto', justifyContent: 'center' }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/list">스파크</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/main">하루</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/news">뉴스</Link>
          </li>
          {userName ? (
            <>
              <li style={{ marginRight: '20px' }}>
                <span>{userName}님</span>
              </li>
              <li style={{ marginRight: '20px' }}>
                <button onClick={onLogout}>로그아웃</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">로그인</Link>
            </li>
          )}
        </ul>
      </nav>

      <div style={{ position: 'absolute', top: '10px', right: '20px' }}>
        <Weather />
      </div>
    </header>
  );
}
