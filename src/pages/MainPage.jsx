import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // 기본 스타일
import styled from "styled-components";

// Styled Components (Calendar 스타일)
const StyledCalendarWrapper = styled.div`
  width: 90%; /* 전체 캘린더의 너비 줄임 */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .react-calendar {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    box-shadow: 4px 2px 10px 0px rgba(0, 0, 0, 0.13);
    padding: 15px; /* 내부 패딩 줄임 */
    background-color: white;
  }

  /* 요일 행 스타일 */
  .react-calendar__month-view__weekdays {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px; /* 요일 높이 줄임 */
    font-size: 0.85rem; /* 글자 크기 살짝 줄임 */
    font-weight: bold;
    color: ${(props) => props.theme?.gray_1 || "#555"};
    border-bottom: 1px solid ${(props) => props.theme?.gray_2 || "#ddd"};
  }

  .react-calendar__month-view__weekdays__weekday {
    display: flex;
    align-items: center; /* 텍스트 수직 중앙 정렬 */
    justify-content: center;
  }

  /* 날짜 셀 스타일 */
  .react-calendar__tile {
    height: 40px; /* 날짜 셀 높이 줄임 */
    width: 40px; /* 셀 크기 줄임 */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 4px; /* 셀 간 간격 */
    font-size: 0.9rem; /* 글자 크기 살짝 줄임 */
    border-radius: 6px;
  }

  .react-calendar__tile--now {
    background: none;
    abbr {
      color: ${(props) => props.theme?.primary_2 || "#1e90ff"};
      font-weight: bold;
    }
  }

  .react-calendar__tile--hasActive {
    background-color: ${(props) => props.theme?.primary_2 || "#1e90ff"};
    abbr {
      color: white;
    }
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    background-color: ${(props) => props.theme?.yellow_2 || "#ffdd57"};
    border-radius: 6px;
  }
`;

const StyledDate = styled.div`
  margin-top: 15px; /* 캘린더와 버튼 간 간격 줄임 */
  background-color: ${(props) => props.theme?.primary_3 || "#007bff"};
  color: ${(props) => props.theme?.yellow_2 || "#ffdd57"};
  width: 100px; /* 버튼 너비 줄임 */
  height: 35px; /* 버튼 높이 줄임 */
  text-align: center;
  line-height: 35px; /* 버튼 텍스트 정렬 */
  border-radius: 15px;
  font-size: 0.9rem; /* 글자 크기 줄임 */
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;



const MainWrapper = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const LeftSection = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RightSection = styled.div`
  flex: 1;
  max-width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function MainPage() {
  const [todos, setTodos] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        setTodos(
          response.data.slice(0, 10).map((item) => ({
            id: item.id,
            title: item.title,
            check: item.completed,
          }))
        );
      } catch (error) {
        console.error('초기 데이터를 불러오는 중 오류 발생:', error.message);
      }
    })();
  }, []);

  const onAdd = async (text) => {
    try {
      await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title: text,
        completed: false,
        userId: 1,
      });

      const id = Math.random().toString(36).substr(2, 9); // 로컬 고유 ID 생성
      setTodos((prevTodos) => [
        ...prevTodos,
        { id, title: text, check: false },
      ]);
    } catch (error) {
      console.error('할 일을 추가하는 중 오류 발생:', error.message);
      alert('할 일을 추가하는 데 실패했습니다.');
    }
  };

  const onDelete = async (id) => {
    try {
      if (id.length <= 5) {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
      }
    } catch (error) {
      console.warn('서버 삭제 실패. 로컬 상태에서만 삭제합니다.');
    }
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const onUpdate = async (id, check) => {
    try {
      if (id.length <= 5) {
        await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, { completed: check });
      }
    } catch (error) {
      console.warn('서버 업데이트 실패. 로컬 상태만 업데이트합니다.');
    }
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, check } : todo
      )
    );
  };

  return (
    <MainWrapper>
      {/* 캘린더 영역 */}
      <LeftSection>
        <h1 style={{ color: '#333', textAlign: 'center' }}>캘린더</h1>
        <StyledCalendarWrapper>
          <Calendar onChange={setCalendarValue} value={calendarValue} />
          <StyledDate onClick={() => setCalendarValue(new Date())}>today</StyledDate>
        </StyledCalendarWrapper>
      </LeftSection>

      {/* 투두리스트 영역 */}
      <RightSection>
        <h1 style={{ color: '#333', textAlign: 'center' }}>투두리스트</h1>
        <TodoInput onAdd={onAdd} />
        <TodoList todos={todos} onDelete={onDelete} onUpdate={onUpdate} />
      </RightSection>
    </MainWrapper>
  );
}

// TodoInput 및 TodoList 컴포넌트는 기존 코드와 동일
function TodoInput({ onAdd }) {
  const [title, setTitle] = useState('');

  const handleKeyPress = (evt) => {
    if (evt.key === 'Enter' && title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <input
      type="text"
      placeholder="투두리스트를 입력해주세요."
      style={{
        width: '100%',
        padding: '10px',
        fontSize: '18px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginBottom: '20px',
        outline: 'none',
      }}
      onKeyPress={handleKeyPress}
      onChange={(evt) => setTitle(evt.target.value)}
      value={title}
    />
  );
}

function TodoList({ todos, onDelete, onUpdate }) {
  return (
    <div style={{ marginTop: '10px', width: '100%' }}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

function TodoItem({ todo, onDelete, onUpdate }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <span
        onClick={() => onUpdate(todo.id, !todo.check)}
        style={{
          flex: 1,
          fontSize: '20px',
          textDecoration: todo.check ? 'line-through' : 'none',
          color: todo.check ? '#aaa' : '#333',
          cursor: 'pointer',
        }}
      >
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          backgroundColor: '#ff4d4f',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          padding: '5px 10px',
          cursor: 'pointer',
          fontSize: '16px',
          textAlign: 'center',
        }}
      >
        delete
      </button>
    </div>
  );
}
