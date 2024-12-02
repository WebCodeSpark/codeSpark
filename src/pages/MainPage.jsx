import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // 기본 스타일

export default function MainPage() {
  const [todos, setTodos] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    // 선택된 날짜의 투두 필터링
    const selectedDate = calendarValue.toISOString().split('T')[0];
    setFilteredTodos(todos.filter((todo) => todo.date === selectedDate));
  }, [calendarValue, todos]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
        setTodos(
          response.data.slice(0, 3).map((item) => ({
            id: item.id,
            title: item.title,
            check: item.completed,
            date: new Date().toISOString().split('T')[0],
          }))
        );
      } catch (error) {
        console.error('초기 데이터를 불러오는 중 오류 발생:', error.message);
      }
    })();
  }, []);

  const groupedTodos = todos.reduce((acc, todo) => {
    if (!acc[todo.date]) {
      acc[todo.date] = [];
    }
    acc[todo.date].push(todo);
    return acc;
  }, {});

  const onAdd = async (text) => {
    try {
      const newTodo = {
        title: text,
        completed: false,
        userId: 1,
        date: calendarValue.toISOString().split('T')[0],
      };

      await axios.post('https://jsonplaceholder.typicode.com/todos', newTodo);

      const id = Math.random().toString(36).substr(2, 9);
      setTodos((prevTodos) => [
        ...prevTodos,
        { id, title: text, check: false, date: newTodo.date },
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
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
      setFilteredTodos(updatedTodos.filter((todo) => todo.date === calendarValue.toISOString().split('T')[0]));
      return updatedTodos;
    });
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
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* 캘린더 영역 */}
      <div style={{ flex: 1, maxWidth: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#333', textAlign: 'center' }}>캘린더</h1>
        <Calendar
          onChange={setCalendarValue}
          value={calendarValue}
          tileContent={({ date, view }) => {
            const dateString = date.toISOString().split('T')[0];
            if (groupedTodos[dateString] && view === 'month') {
              return (
                <div
                  style={{
                    height: '10px',
                    width: '10px',
                    backgroundColor: '#ffdd57',
                    borderRadius: '50%',
                    marginTop: '4px',
                  }}
                ></div>
              );
            }
            return null;
          }}
        />
        <button onClick={() => setCalendarValue(new Date())} style={{
          marginTop: '15px',
          width: '100px',
          height: '35px',
          textAlign: 'center',
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}>
          today
        </button>
      </div>

      {/* 투두리스트 영역 */}
      <div style={{ flex: 1, maxWidth: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#333', textAlign: 'center' }}>투두리스트</h1>
        <TodoInput onAdd={onAdd} />
        <TodoList todos={filteredTodos} onDelete={onDelete} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

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
      {todos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>선택한 날짜에 투두가 없습니다.</p>
      ) : (
        todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onUpdate={onUpdate} />
        ))
      )}
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
