import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Header from './components/Header';  
import MainPage from './pages/MainPage';
import LinkPage from './pages/LinkPage';  
import CalendarPage from './pages/CalendarPage'; 
import Footer from './components/Footer';
import UploadPage from './pages/UploadPage';
import PostPage  from './pages/PostPage';
import ListPage  from './pages/ListPage';
import LoginPage from './pages/LoginPage';
import WeatherPage from './pages/WeatherPage';
import NewsPage from './pages/NewsPage';

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
          <Route path="/news" element={<NewsPage />}/>
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
