import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { chat, dalle } from './openai'; 

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

function TodoList({ todos, onDelete, onUpdate, makeImage }) {
  return (
    <div style={{ marginTop: '10px', width: '100%' }}>
      {todos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>선택한 날짜에 투두가 없습니다.</p>
      ) : (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onUpdate={onUpdate}
            makeImage={makeImage}
          />
        ))
      )}
    </div>
  );
}

function TodoItem({ todo, onDelete, onUpdate, makeImage }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
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

      {todo.image && (
        <img
          src={todo.image}
          alt={`Generated ${todo.id}`}
          style={{ width: 50, height: 50, marginLeft: '10px' }}
        />
      )}

      <button onClick={() => makeImage(todo.id, todo.title)}>이미지 생성</button>
      <button
        onClick={() => onDelete(todo.id)}
        style={{
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

export default function MainPage() {
  const [todos, setTodos] = useState([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const [filteredTodos, setFilteredTodos] = useState([]);
  const remain = todos.filter(todo => todo.check === false).length;

  const [text, setText] = useState('');
  const [result, setResult] = useState([]);

  const resetToMidnight = (date) => {
    const resetDate = new Date(date);
    resetDate.setHours(0, 0, 0, 0);
    return resetDate;
  };

  const makeImage = (todoId, todoTitle) => {
    const prompt = `다음 문장을 영어로 번역하고, 문장에 맞는 이모지 생성해주세요: "${todoTitle}"`;
    chat(prompt, (result) => {
      dalle(
        result,
        (images) => {
          const imageUrl = images[0]?.url || ''; 
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo.id === todoId ? { ...todo, image: imageUrl } : todo
            )
          );
        },
        1
      );
    });
  };

  useEffect(() => {
    const selectedDate = calendarValue.toISOString().split('T')[0];
    setFilteredTodos(todos.filter((todo) => todo.date === selectedDate));
  }, [calendarValue, todos]);

  const onAdd = async (text) => {
    const id = Date.now().toString();
    const newTodo = {
      id,
      title: text,
      check: false,
      userId: 1,
      date: calendarValue.toISOString().split('T')[0],
    };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const onDelete = (id) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.filter((todo) => todo.id !== id);
      setFilteredTodos(updatedTodos.filter((todo) => todo.date === calendarValue.toISOString().split('T')[0]));
      return updatedTodos;
    });
  };

  const onUpdate = (id, check) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, check } : todo
      )
    );
  };

  const groupedTodos = todos.reduce((acc, todo) => {
    const date = todo.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(todo);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ flex: 1, maxWidth: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ color: '#333', textAlign: 'center' }}>캘린더</h3>
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
        <button
          onClick={() => setCalendarValue(resetToMidnight(new Date()))} 
          style={{
            marginTop: '15px',
            width: '100px',
            height: '35px',
            textAlign: 'center',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          today
        </button>
      </div>

      <div style={{ flex: 1, maxWidth: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ color: '#333', textAlign: 'center' }}>투두리스트</h3>
        <span style={{ fontSize: 20 }}>
          {remain}개/{todos.length}개
        </span>
        <TodoInput onAdd={onAdd} />
        <TodoList todos={filteredTodos} onDelete={onDelete} onUpdate={onUpdate} makeImage={makeImage} />
      </div>
    </div>
  );
}
