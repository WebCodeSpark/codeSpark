import React from 'react';
import { Link } from 'react-router-dom';
import Weather from '../pages/WeatherPage';

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
            <Link to="/list" className="nav-item">스파크</Link>
          </li>
          <li>
            <Link to="/main" className="nav-item">하루</Link>
          </li>
          {userName ? (
            <>
              <li>
                <span className="logout-button">{userName}님</span>
              </li>
              <li>
                <button onClick={onLogout} className="logout-button">로그아웃</button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="nav-item">로그인</Link>
            </li>
          )}
        </ul>
      </nav>

      <div style={{ position: 'absolute', top: '10px', right: '20px' }}>
        <Weather />
      </div>

      <style>
        {`
          header {
            background-color: #333;
            color: white;
            padding: 30px;
            text-align: center;
          }

          .centered-title {
            font-size: 36px;
            margin: 0;
            font-weight: bold; 
          }

          .horizontal-nav {
            list-style: none;
            display: flex;
            justify-content: center;
            padding: 0;
            margin: 30px 0 0 0;
            gap: 20px;
          }

          .horizontal-nav li {
            display: flex;
            align-items: center;
          }

          .nav-item {
            color: white;
            padding: 8px 12px;
            text-decoration: none;
            cursor: pointer;
            font-weight: 600;
            font-size:18px;
          }

          .nav-item:hover {
            background-color: #0077cc; 
          }

          .logout-button {
            background-color: transparent;
            border:none;
            padding: 6px 12px;
            cursor: pointer;
            color: white;
            font-weight: 600;
            font-size:18px;
          }

          .logout-button:hover {
            background-color: #0077cc;
            color: white;
          }
        `}
      </style>
    </header>
  );
}
