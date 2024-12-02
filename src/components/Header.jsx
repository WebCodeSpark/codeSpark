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
      <h1 className="centered-title">CodeSpark</h1>
      <nav>
        <ul className="horizontal-nav">
          <li>
            <Link to="/search">검색</Link>
          </li>
          <li>
            <Link to="/upload">새 글 작성</Link>
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
        </ul>
      </nav>
      <style>
        {`
          /* 중앙 정렬된 제목 */
          .centered-title {
            text-align: center; /* 텍스트 중앙 정렬 */
            margin: 0; /* 불필요한 기본 마진 제거 */
            font-size: 24px; /* 적절한 제목 크기 */
            padding: 10px 0; /* 제목 상하 여백 */
          }

          /* 가로로 나열되는 리스트 */
          .horizontal-nav {
            list-style: none;
            display: flex; /* 플렉스 박스로 설정 */
            justify-content: center; /* 가운데 정렬 */
            padding: 0;
            margin: 0;
            gap: 20px; /* 항목 간 간격 */
            flex-wrap: nowrap; /* 한 줄에 모든 항목이 배치되도록 설정 */
          }

          .horizontal-nav li {
            margin: 0; /* 불필요한 마진 제거 */
          }

          /* 링크 및 버튼 스타일링 */
          .horizontal-nav a,
          .horizontal-nav button {
            text-decoration: none;
            color: #333;
            padding: 8px 12px;
            border: none;
            background: none;
            cursor: pointer;
          }

          .horizontal-nav a:hover,
          .horizontal-nav button:hover {
            color: #007bff; /* 강조 색상 */
            text-decoration: underline;
          }
        `}
      </style>
    </header>
  );
}
