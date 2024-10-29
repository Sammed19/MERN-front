import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://mern-backend-application.onrender.com/api/todos');
        setTodos(response.data);
      } catch (err) {
        setError('Failed to load todos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const response = await axios.post('https://mern-backend-application.onrender.com/api/todos', { title });
      setTodos([...todos, response.data]);
      setTitle('');
    } catch (err) {
      setError('Failed to add todo. Please try again later.');
    }
  };

  // Update todo completion status
  const toggleCompletion = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      setError('');
      setTodos(
        todos.map((t) =>
          t._id === id ? { ...t, completed: !t.completed } : t
        )
      );
      await axios.patch(`https://mern-backend-application.onrender.com/api/todos/${id}`, {
        completed: !todo.completed,
      });
    } catch (err) {
      setError('Failed to update todo status. Please try again later.');
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setError('');
      setTodos(todos.filter((t) => t._id !== id));
      await axios.delete(`https://mern-backend-application.onrender.com/api/todos/${id}`);
    } catch (err) {
      setError('Failed to delete todo. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addTodo}>
        <input
          className="input-container"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Add a new todo"
        />
        <button type="submit">Add Todo</button>
      </form>
      {loading ? (
        <p>Loading todos...</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              <span
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  cursor: 'pointer',
                }}
                onClick={() => toggleCompletion(todo._id)}
              >
                {todo.title}
              </span>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoApp;
