import React from "react";
import { useSelector } from "react-redux";
import { selectAllTodos, selectCompletedTodos } from "../state/todoSlice";
import ProgressTracker from "../components/ProgressTracker";
import "../styles/HomePage.css";

export const HomePage = () => {
  // Get todos from Redux store
  const allTodos = useSelector(selectAllTodos);
  const completedTodos = useSelector(selectCompletedTodos);

  // Calculate statistics
  const totalTasks = allTodos?.length || 0;
  const completedCount = completedTodos?.length || 0;

  return (
    <div className="homepage">
      <div className="welcome-section">
        <h1>Welcome to TaskFlow</h1>
        <p className="welcome-subtitle">
          Your personal task management dashboard
        </p>
      </div>

      {totalTasks > 0 ? (
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
