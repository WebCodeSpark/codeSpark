import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';  // Header 컴포넌트 임포트
import ProfilePage from './pages/ProfilePage';  // ProfilePage 컴포넌트 임포트
import MainPage from './pages/MainPage';
import LinkPage from './pages/LinkPage';  // LinkPage 컴포넌트 임포트
import CalendarPage from './pages/CalendarPage'; // Calendar 컴포넌트 임포트
import Footer from './components/Footer';
import UploadPage from './pages/UploadPage';
import PostPage  from './pages/PostPage';
import ListPage  from './pages/ListPage';
import LoginPage from './pages/LoginPage';

function App() {

  const [posts, setPosts] = useState([]);

  return (
    <Router>
      <Header />
      
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/link" element={<LinkPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/upload" element={<UploadPage posts={posts} setPosts={setPosts} />} />
          <Route path="/post/:postId" element={<PostPage posts={posts} setPosts={setPosts} />} />
          <Route path="/list" element={<ListPage posts={posts} setPosts={setPosts} />} />
          <Route path='/login' element={<LoginPage/>} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
