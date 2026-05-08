import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import axios from 'axios';

// ⚠️ Yahan apna sahi Vercel production URL dalo
const API_URL = "https://haris-mern-todo-app.vercel.app/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const styles = {
    wrapper: {
      backgroundColor: '#000000',
      minHeight: '100vh',
      width: '100vw',
      display: 'grid',
      placeItems: 'center',
      fontFamily: "'Inter', sans-serif",
      margin: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      color: '#ffffff',
      overflowY: 'auto'
    },
    container: {
      backgroundColor: '#0a0a0a', 
      width: '90%',
      maxWidth: '420px',
      borderRadius: '24px',
      padding: '40px',
      border: '1px solid #1a1a1a',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
    },
    title: {
      textAlign: 'center',
      fontSize: '32px',
      fontWeight: '900',
      marginBottom: '35px',
      letterSpacing: '2px'
    },
    violetText: {
      color: '#7c3aed' 
    },
    inputGroup: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px'
    },
    inputField: {
      flex: 1,
      padding: '16px 20px',
      borderRadius: '12px',
      border: '1px solid #222',
      backgroundColor: '#111',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
      transition: '0.3s'
    },
    addButton: {
      backgroundColor: '#7c3aed',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      width: '56px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: '0.2s'
    },
    todoCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px',
      backgroundColor: '#111',
      borderRadius: '14px',
      marginBottom: '12px',
      border: '1px solid #1a1a1a',
      animation: 'fadeIn 0.3s ease'
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleAdd = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(API_URL, { text: input });
      setTodos([...todos, res.data]);
      setInput('');
    } catch (err) { console.error("Add Error:", err); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`);
      setTodos(todos.map(t => t._id === id ? res.data : t));
    } catch (err) { console.error("Toggle Error:", err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) { console.error("Delete Error:", err); }
  };

  return (
    <div style={styles.wrapper}>
      <style>{`
        body { margin: 0; background-color: #000; overflow: hidden; }
        input:focus { border-color: #7c3aed !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #7c3aed; borderRadius: 10px; }
      `}</style>

      <div style={styles.container}>
        <h2 style={styles.title}>
          TODO <span style={styles.violetText}>LIST</span>
        </h2>

        <div style={styles.inputGroup}>
          <input 
            autoFocus
            style={styles.inputField}
            placeholder="Create Task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button 
            style={styles.addButton} 
            onClick={handleAdd}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6d28d9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
          >
            <Plus size={28} />
          </button>
        </div>

        <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
          {todos.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#444', marginTop: '20px' }}>No pending tasks!</p>
          ) : (
            todos.map(todo => (
              <div key={todo._id} style={styles.todoCard}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', flex: 1 }}
                  onClick={() => handleToggle(todo._id)}
                >
                  {todo.completed ? 
                    <CheckCircle size={22} color="#7c3aed" /> : 
                    <Circle size={22} color="#333" />
                  }
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#444' : '#eee',
                    fontSize: '16px'
                  }}>
                    {todo.text}
                  </span>
                </div>
                <Trash2 
                  size={18} 
                  color="#ef4444" 
                  style={{ cursor: 'pointer', opacity: 0.7 }} 
                  onClick={(e) => { e.stopPropagation(); handleDelete(todo._id); }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;