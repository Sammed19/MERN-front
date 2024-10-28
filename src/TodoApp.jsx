// client/src/TodoApp.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  // Fetch todos from backend
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        setTodos(response.data);
      } catch (err) {
        setError('Failed to load todos. Please try again later.');
        console.error(err);
      }
    };
    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/todos', { title });
      setTodos([...todos, response.data]);
      setTitle('');
    } catch (err) {
      setError('Failed to add todo. Please try again later.');
      console.error(err);
    }
  };

  // Update todo completion status
  const toggleCompletion = async (id) => {
    const todo = todos.find((t) => t._id === id);
    try {
      await axios.patch(`http://localhost:5000/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(
        todos.map((t) =>
          t._id === id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch (err) {
      setError('Failed to update todo status. Please try again later.');
      console.error(err);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addTodo}>
        <input className="input-container"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Add a new todo"
        />
        <button type="submit">Add Todo</button>
      </form>
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
            <button  onClick={() => deleteTodo(todo._id)} >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
