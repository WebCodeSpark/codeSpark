import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsPage = () => {
  const [news, setNews] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const fetchNews = async () => {
    const clientId = process.env.REACT_APP_NEWS_CLIENTID_KEY; 
    const clientSecret = process.env.REACT_APP_NEWS_CLIENTSECRET_KEY; 

    try {
      const response = await axios.get("v1/search/news", {
        params: {
          query: "코딩", 
          display: 10, 
          start: 1, 
          sort: "sim", 
        },
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      });

      setNews(response.data.items); 
      setLoading(false); 
    } catch (error) {
      setError("뉴스를 불러오는 데 실패했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(); 
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>뉴스 목록</h1>
      <ul>
        {news.map((item, index) => (
          <li key={index}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              {item.title.replace(/<[^>]*>?/g, "")}
            </a>
            <p>{item.description.replace(/<[^>]*>?/g, "")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPage;
