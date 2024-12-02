import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  return (
    <header>
       <h1 className="centered-title">
        <Link to="/list" style={{ textDecoration: 'none', color: 'inherit' }}>
          CodeSpark
        </Link>
      </h1>
      <br/>
      <nav>
        <ul className="horizontal-nav">
          {userEmail && (
            <li>
              <button onClick={handleLogout}>로그아웃</button>
            </li>
          )}
          <li>
            <Link to="/list">스파크</Link>
          </li>
          <li>
            <Link to="/main">하루</Link>
          </li>
          <li>
            <Link to="/profile">프로필</Link>
          </li>
          {userEmail ? (
            <li>
              <span>{userEmail}님</span>
            </li>
          ) : (
            <li>
              <Link to="/login">로그인</Link>
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
          }
        `}
      </style>
    </header>
  );
}
