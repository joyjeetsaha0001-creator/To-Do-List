import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from "react";

// Simple To‑Do app using Bootstrap classes // Single-file React component (default export) // Features: add, toggle complete, edit, delete, persistence via localStorage

export default function TodoApp() {
  const [taskText, setTaskText] = useState(""); const [tasks, setTasks] = useState([]); const [editingId, setEditingId] = useState(null);

  const STORAGE_KEY = "bootstrap_todo_tasks_v1";

  useEffect(() => { try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setTasks(JSON.parse(raw)); } catch (e) { console.error("Failed to read tasks from localStorage", e); } }, []);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch (e) { console.error("Failed to save tasks to localStorage", e); } }, [tasks]);

  function addOrSaveTask(e) {
    e.preventDefault(); const trimmed = taskText.trim(); if (!trimmed) return;

    if (editingId !== null) {
      setTasks((prev) => prev.map(t => t.id === editingId ? { ...t, text: trimmed } : t));
      setEditingId(null);
    } else {
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), text: trimmed, done: false }
      ]);
    }

    setTaskText("");

  }

  function toggleDone(id) { setTasks((prev) => prev.map(t => t.id === id ? { ...t, done: !t.done } : t)); }

  function removeTask(id) { setTasks((prev) => prev.filter(t => t.id !== id)); if (editingId === id) { setEditingId(null); setTaskText(""); } }

  function startEdit(task) { setEditingId(task.id); setTaskText(task.text); }

  function clearAll() { if (!window.confirm("Clear all tasks?")) return; setTasks([]); setEditingId(null); setTaskText(""); }

  return (<div className="container" style={{ maxWidth: 700, marginTop: 48 }}> <div className="card shadow-sm"> <div className="card-body"> <h3 className="card-title mb-3">📝To Do List </h3>

    <form onSubmit={addOrSaveTask} className="mb-3">
      <div className="input-group">
        <input
          className="form-control"
          placeholder="Enter a task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          aria-label="New task"
        />
        <button className="btn btn-primary" type="submit">
          {editingId !== null ? "Save" : "Add"}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => { setTaskText(""); setEditingId(null); }}
        >
          Cancel
        </button>
      </div>
    </form>

    <div className="mb-2 d-flex justify-content-between align-items-center">
      <small className="text-muted">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</small>
      <div>
        <button className="btn btn-sm btn-danger me-2" onClick={clearAll} disabled={tasks.length === 0}>Clear All</button>
      </div>
    </div>

    <ul className="list-group">
      {tasks.length === 0 && (
        <li className="list-group-item text-center text-muted">No tasks yet — add one above.</li>
      )}

      {tasks.map((t) => (
        <li key={t.id} className="list-group-item d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <input
              className="form-check-input me-2"
              type="checkbox"
              checked={t.done}
              onChange={() => toggleDone(t.id)}
              //aria-label={Mark ${t.text} done}
              />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none', opacity: t.done ? 0.6 : 1 }}>
              {t.text}
            </span>
          </div>

          <div>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => startEdit(t)}>Edit</button>
            <button className="btn btn-sm btn-danger" onClick={() => removeTask(t.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>

  </div>
  </div>

    <footer className="text-center mt-3 text-muted small">Saved locally in your browser (localStorage)</footer>
  </div>

  );
}
