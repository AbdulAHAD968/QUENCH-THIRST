import React, { useState, useEffect } from "react";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      setTasks(storedTasks);
    } catch (e) {
      console.error("Failed to parse tasks from localStorage:", e);
      setTasks([]);
    }
  }, []);  

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
      }
    ]);
    setNewTask("");
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingTasks = tasks.filter((task) => !task.completed).length;

  return (
    <div className="todo-container">
      <h1 className="todo-header">Todo List</h1>
      <form onSubmit={addTask} className="task-form">
        <div className="input-group">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="task-input"
            autoFocus
          />
          <button 
            type="submit" 
            className="add-btn"
            disabled={!newTask.trim()}
          >
            Add
          </button>
        </div>
      </form>

      {tasks.length > 0 && (
        <div className="task-controls">
          <span className="items-left">
            {remainingTasks} {remainingTasks === 1 ? "item" : "items"} left
          </span>
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
          <button 
            className="clear-btn" 
            onClick={clearCompleted}
          >
            Clear Completed
          </button>
        </div>
      )}

      <ul className="task-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <li key={task.id} className="task-item">
              <label className="task-label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleCompletion(task.id)}
                  className="task-checkbox"
                />
                <span className={`task-text ${task.completed ? "completed" : ""}`}>
                  {task.text}
                </span>
              </label>
              <button
                onClick={() => removeTask(task.id)}
                className="delete-btn"
                aria-label="Delete task"
              >
                ×
              </button>
            </li>
          ))
        ) : (
          <div className="empty-message">
            {filter === "all"
              ? "No tasks yet. Add one above!"
              : filter === "active"
              ? "No active tasks!"
              : "No completed tasks!"}
          </div>
        )}
      </ul>
    </div>
  );
};

export default TodoList;