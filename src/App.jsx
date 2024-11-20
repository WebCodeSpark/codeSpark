import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';  // Header 컴포넌트 임포트
import LatestPage from './pages/LatestPage';  // LatestPage 컴포넌트 임포트
import MyPage from './pages/MyPage';  // MyPage 컴포넌트 임포트
import ProfilePage from './pages/ProfilePage';  // ProfilePage 컴포넌트 임포트
import MainPage from './pages/MainPage';

function App() {
  return (
    <Router>
      {/* Header 컴포넌트 렌더링 */}
      <Header />
      
      <div style={{ padding: '20px' }}>
        {/* Routes와 Route를 통해 페이지 렌더링 */}
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/latest" element={<LatestPage />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
