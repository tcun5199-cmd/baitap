import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';

// Danh sách icon minh họa công việc ngẫu nhiên/lựa chọn
const TASK_ICONS = ['📚', '💻', '🎨', '📝', '☕', '🛒', '🏃‍♂️', '🎯'];

// 1. Component Thêm Todo
function AddTodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📌');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, selectedIcon);
    setText('');
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <div className="icon-selector">
        <select 
          value={selectedIcon} 
          onChange={(e) => setSelectedIcon(e.target.value)}
          title="Chọn icon minh họa"
        >
          {TASK_ICONS.map((icon, idx) => (
            <option key={idx} value={icon}>{icon}</option>
          ))}
        </select>
      </div>
      <input
        type="text"
        placeholder="Nhập công việc cần làm..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Tên công việc mới"
      />
      <button type="submit" className="btn-add">
        <span>➕</span> Thêm
      </button>
    </form>
  );
}

AddTodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};

// 2. Component Item Công việc
function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="checkmark"></span>
      </label>
      
      <span className="todo-icon">{todo.icon || '📌'}</span>
      <span className="todo-text">{todo.text}</span>
      
      <button
        className="delete-btn"
        onClick={() => onDelete(todo.id)}
        title="Xóa công việc"
      >
        🗑️
      </button>
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    icon: PropTypes.string,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// 3. Component Danh Sách Todo
function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration">🎉</div>
        <p className="empty-title">Tuyệt vời! Không có công việc nào.</p>
        <p className="empty-subtitle">Hãy thêm công việc mới để bắt đầu ngày làm việc hiệu quả!</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// 4. Component Bộ Lọc (FilterBar)
function FilterBar({ currentFilter, onFilterChange }) {
  const filters = [
    { key: 'all', label: 'Tất cả', icon: '📂' },
    { key: 'active', label: 'Đang làm', icon: '⏳' },
    { key: 'completed', label: 'Đã xong', icon: '✅' },
  ];

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f.key}
          className={`filter-btn ${currentFilter === f.key ? 'active' : ''}`}
          onClick={() => onFilterChange(f.key)}
        >
          <span className="filter-icon">{f.icon}</span> {f.label}
        </button>
      ))}
    </div>
  );
}

FilterBar.propTypes = {
  currentFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

// 5. Component Thống kê Tiến độ (Stats & Progress)
function Stats({ todos }) {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-container">
      <div className="stats-info">
        <span>📊 Tiến độ hoàn thành</span>
        <strong>{completed} / {total} ({percent}%)</strong>
      </div>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

Stats.propTypes = {
  todos: PropTypes.array.isRequired,
};

// --- APP COMPONENT CHÍNH ---
function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Học bài Lesson 5 Frontend', completed: false, icon: '📚' },
      { id: 2, text: 'Luyện tập React Hooks & State', completed: true, icon: '💻' }
    ];
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text, icon) => {
    const newTodo = { id: Date.now(), text, completed: false, icon };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-icon">📝</div>
        <div>
          <h1>Task Manager</h1>
          <p className="header-subtitle">Quản lý công việc thông minh & hiệu quả</p>
        </div>
      </header>

      <AddTodoForm onAdd={addTodo} />
      <FilterBar currentFilter={filter} onFilterChange={setFilter} />
      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
      <Stats todos={todos} />
    </div>
  );
}

export default App;