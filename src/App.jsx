import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';  // Header 컴포넌트 임포트
import MainPage from './pages/MainPage';
import LinkPage from './pages/LinkPage';  // LinkPage 컴포넌트 임포트
import CalendarPage from './pages/CalendarPage'; // Calendar 컴포넌트 임포트
import Footer from './components/Footer';
import UploadPage from './pages/UploadPage';
import PostPage  from './pages/PostPage';
import ListPage  from './pages/ListPage';
import LoginPage from './pages/LoginPage';
import WeatherPage from './pages/WeatherPage';

function App() {

  const [posts, setPosts] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogout = () => {
    setLoggedInUser(null); 
  };

  return (
    <Router>
       <Header 
        userName={loggedInUser?.username} 
        onLogout={handleLogout} 
      />
      
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/link" element={<LinkPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/upload" element={<UploadPage posts={posts} setPosts={setPosts} />} />
          <Route path="/post/:postId" element={<PostPage posts={posts} setPosts={setPosts} />} />
          <Route path="/list" element={<ListPage posts={posts} setPosts={setPosts} />} />
          <Route 
            path="/login" 
            element={<LoginPage setLoggedInUser={setLoggedInUser} />} 
          />
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
