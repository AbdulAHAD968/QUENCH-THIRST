import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState({ id: null, text: "" });
  const [categories, setCategories] = useState(["Work", "Personal", "Shopping"]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("khata") || "[]");
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("khata", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (e) => {
    e.preventDefault();
    const task = newTask.trim();

    if (!task) {
      alert("Please enter a valid task!");
      return;
    }

    if (tasks.some((t) => t.text === task)) {
      alert("Task already exists!");
      return;
    }

    const newTaskObj = {
      id: Date.now(),
      text: task,
      completed: false,
      category: selectedCategory,
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask("");
    setSelectedCategory("");
  };

  // Remove a task
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Toggle task completion
  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Edit a task
  const startEditing = (id, text) => {
    setEditingTask({ id, text });
  };

  const saveEdit = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: editingTask.text } : task
    );
    setTasks(updatedTasks);
    setEditingTask({ id: null, text: "" });
  };

  // Handle drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  return (
    <div className="todo-list-wrapper">
      <div className="todo-list-container">
        <h1 className="todo-list-title">Todo List</h1>
        <form onSubmit={addTask} className="todo-list-form">
          <input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="todo-list-input"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="todo-list-select"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button type="submit" className="todo-list-add-button">
            Add
          </button>
        </form>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="todo-list-ul"
              >
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="todo-list-li"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleCompletion(task.id)}
                          className="todo-list-checkbox"
                        />
                        {editingTask.id === task.id ? (
                          <input
                            type="text"
                            value={editingTask.text}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, text: e.target.value })
                            }
                            className="todo-list-edit-input"
                          />
                        ) : (
                          <span
                            className={`todo-list-task-text ${
                              task.completed ? "completed" : ""
                            }`}
                          >
                            {task.text} <small>({task.category})</small>
                          </span>
                        )}
                        <div className="todo-list-actions">
                          {editingTask.id === task.id ? (
                            <button
                              onClick={() => saveEdit(task.id)}
                              className="todo-list-save-button"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              onClick={() => startEditing(task.id, task.text)}
                              className="todo-list-edit-button"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => removeTask(task.id)}
                            className="todo-list-remove-button"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TodoList;