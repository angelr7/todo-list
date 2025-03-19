import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllTodos,
  selectCompletedTodos,
  fetchTodos,
  selectTodoStatus,
} from "../state/todoSlice";
import ProgressTracker from "../components/ProgressTracker";
import "../styles/HomePage.css";

export const HomePage = () => {
  const dispatch = useDispatch();
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const status = useSelector(selectTodoStatus);

  // Get todos from Redux store
  const allTodos = useSelector(selectAllTodos);
  const completedTodos = useSelector(selectCompletedTodos);

  // Calculate statistics
  const totalTasks = allTodos?.length || 0;
  const completedCount = completedTodos?.length || 0;

  // Fetch all todos on component mount
  useEffect(() => {
    if (!initialLoadDone) {
      dispatch(fetchTodos());
      setInitialLoadDone(true);
    }
  }, [dispatch, initialLoadDone]);

  return (
    <div className="homepage">
      <div className="welcome-section">
        <h1>Welcome to TaskFlow</h1>
        <p className="welcome-subtitle">
          Your personal task management dashboard
        </p>
      </div>

      {status === "loading" && !initialLoadDone ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading your tasks...</p>
        </div>
      ) : totalTasks > 0 ? (
        <ProgressTracker completed={completedCount} total={totalTasks} />
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>No tasks yet</h2>
          <p>Get started by creating your first task.</p>
          <a href="/todos" className="action-button">
            Get Started
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePage;
