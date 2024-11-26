import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';  // Header 컴포넌트 임포트
import LatestPage from './pages/LatestPage';  // LatestPage 컴포넌트 임포트
import MyPage from './pages/MyPage';  // MyPage 컴포넌트 임포트
import ProfilePage from './pages/ProfilePage';  // ProfilePage 컴포넌트 임포트
import MainPage from './pages/MainPage';
import LinkPage from './pages/LinkPage';  // LinkPage 컴포넌트 임포트
import CalendarPage from './pages/CalendarPage'; // Calendar 컴포넌트 임포트
import FollowPage from './pages/FollowPage'; // Follow 컴포넌트 임포트
import Footer from './components/Footer';
import SearchPage from'./pages/SearchPage';
import UploadPage from './pages/UploadPage';
import PostPage  from './pages/PostPage';

function App() {

  const [posts, setPosts] = useState([]);

  return (
    <Router>
      {/* Header 컴포넌트 렌더링 */}
      <Header />
      
      <div style={{ padding: '20px' }}>
        {/* Routes와 Route를 통해 페이지 렌더링 */}
        <Routes>
          {/* 기본 경로에 대한 리다이렉트 설정 */}
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/latest" element={<LatestPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/link" element={<LinkPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/follow" element={<FollowPage />} />
          <Route path="/search" element={<SearchPage posts={posts} />} />
          <Route path="/upload" element={<UploadPage posts={posts} setPosts={setPosts} />} />
          <Route path="/post/:postId" element={<PostPage posts={posts} setPosts={setPosts} />} />

        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
