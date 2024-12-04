import React, { useState, useEffect } from "react";
import axios from "axios";

const NewsPage = () => {
  const [news, setNews] = useState([]); // 뉴스 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리

  const fetchNews = async () => {
    const clientId = process.env.REACT_APP_NEWS_CLIENTID_KEY; // 네이버 API 클라이언트 ID
    const clientSecret = process.env.REACT_APP_NEWS_CLIENTSECRET_KEY; // 네이버 API 클라이언트 Secret

    try {
      const response = await axios.get("v1/search/news", {
        params: {
          query: "코딩", // 검색할 키워드
          display: 10, // 표시할 뉴스 개수
          start: 1, // 검색 시작 위치
          sort: "sim", // 정렬 순서 (sim: 유사도, date: 날짜)
        },
        headers: {
          "X-Naver-Client-Id": clientId,
          "X-Naver-Client-Secret": clientSecret,
        },
      });

      setNews(response.data.items); // 뉴스 데이터 설정
      setLoading(false); // 로딩 종료
    } catch (error) {
      setError("뉴스를 불러오는 데 실패했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
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
              {item.title.replace(/<[^>]*>?/g, "")} {/* HTML 태그 제거 */}
            </a>
            <p>{item.description.replace(/<[^>]*>?/g, "")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPage;
