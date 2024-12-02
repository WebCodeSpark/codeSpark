import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ userName, onLogout }) {
  return (
    <header>
      <h1 className="centered-title">
        <Link to="/list" style={{ textDecoration: 'none', color: 'inherit' }}>
          CodeSpark
        </Link>
      </h1>
      <nav>
        <ul className="horizontal-nav">
          <li>
            <Link to="/list">스파크</Link>
          </li>
          <li>
            <Link to="/main">하루</Link>
          </li>
          <li>
            <Link to="/profile">프로필</Link>
          </li>
          {userName ? (
            <>
              <li>
                <span aria-label="Logged in user">{userName}님</span>
              </li>
              <li>
                <button 
                  onClick={onLogout} 
                  aria-label="Logout button"
                  className="logout-button"
                >
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" aria-label="Login link">로그인</Link>
            </li>
          )}
        </ul>
      </nav>
      <style>
        {`
          .centered-title {
            text-align: center; 
            margin: 0;
            padding: 10px 0; 
            font-size: 24px;
          }

          .horizontal-nav {
            list-style: none;
            display: flex; 
            justify-content: center; 
            padding: 0;
            margin: 0;
            gap: 20px; 
            flex-wrap: nowrap; 
          }

          .horizontal-nav li {
            margin: 0; 
          }

          .horizontal-nav a,
          .horizontal-nav button {
            text-decoration: none;
            color: #333;
            padding: 8px 12px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 16px;
          }

          .logout-button {
            background-color: transparent;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .logout-button:hover {
            background-color: #f0f0f0;
          }
        `}
      </style>
    </header>
  );
}
