import React, { useState, useEffect } from 'react';
import axios from 'axios';

const url = 'https://jsonplaceholder.typicode.com/todos';
export default function MainPage() {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(url);
      setTodos(response.data.slice(0, 10)); // 제한된 개수만 가져오기
    })();
  }, []);

  const onAdd = async (text) => {
    const response = await axios.post(url, {
      title: text,
      checked: true,
      userId: 1,
    });

    const id = response.data.id;
    setTodos([...todos, { id, title: text, check: false }]);
  };
  const onDelete = async (id) => {
    await axios.delete(url + '/' + id);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onUpdate = async (id, check) => {
    await axios.put(url + '/' + id, { check });
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) return { ...todo, check };
        return todo;
      })
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      
      <h1 style={{ color: '#333' }}>투두리스트</h1>
      <input
        type="text"
        placeholder="Add a new task..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '18px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '20px',
          outline: 'none',
        }}
        onKeyPress={(evt) => {
          if (evt.key === 'Enter' && title.trim()) {
            onAdd(title.trim());
            setTitle('');
          }
        }}
        onChange={(evt) => setTitle(evt.target.value)}
        value={title}
      />

      <div style={{ marginTop: '10px' }}>
        {todos.map((todo) => (
          <div
            key={todo.id}
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
        ))}
      </div>

    </div>
  );
}
