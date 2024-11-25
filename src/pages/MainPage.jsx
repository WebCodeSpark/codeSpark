import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/todos';

export default function MainPage() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(url);
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
      await axios.post(url, {
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
      if (id.length <= 5) { // JSONPlaceholder ID만 서버 요청
        await axios.delete(`${url}/${id}`);
      }
    } catch (error) {
      console.warn('서버 삭제 실패. 로컬 상태에서만 삭제합니다.');
    }
    // 로컬 상태 업데이트
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };
  

  const onUpdate = async (id, check) => {
    try {
      if (id.length <= 5) { // JSONPlaceholder ID만 서버 업데이트
        await axios.put(`${url}/${id}`, { completed: check });
      }
    } catch (error) {
      console.warn('서버 업데이트 실패. 로컬 상태만 업데이트합니다.');
    }
    // 로컬 상태 업데이트
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, check } : todo
      )
    );
  };
  
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>투두리스트</h1>
      <TodoInput onAdd={onAdd} />
      <TodoList todos={todos} onDelete={onDelete} onUpdate={onUpdate} />
    </div>
  );
}

// TodoInput 컴포넌트
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

// TodoList 컴포넌트
function TodoList({ todos, onDelete, onUpdate }) {
  return (
    <div style={{ marginTop: '10px' }}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

// TodoItem 컴포넌트
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
