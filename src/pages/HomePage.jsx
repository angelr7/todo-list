import React from "react";
import { useSelector } from "react-redux";
import { selectAllTodos, selectCompletedTodos } from "../state/todoSlice";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "../styles/Common.css";
import "../App.css";
import "../styles/HomePage.css";

/**
 * Task completion progress tracker component
 */
const TaskProgressTracker = ({ completed, total }) => {
  // Handle edge case when there's no data
  if (total === 0) {
    return (
      <div className="progress-card">
        <div className="progress-header">
          <h2>Task Progress</h2>
          <div className="progress-percentage">
            <span className="percentage-text">0%</span>
            <span className="percentage-label">completed</span>
          </div>
        </div>
        <div className="progress-body">
          <p className="no-data-message">Add tasks to see your progress</p>
        </div>
      </div>
    );
  }

  // Ensure data values are valid numbers
  const completedValue = isNaN(completed) ? 0 : completed;
  const remainingValue = isNaN(total - completed) ? 0 : total - completed;

  // Data for the pie chart
  const data = [
    { name: "Completed", value: completedValue, color: "var(--success)" },
    { name: "To Do", value: remainingValue, color: "var(--divider)" },
  ];

  // Filter out any entries with zero value to prevent chart rendering issues
  const filteredData = data.filter((entry) => entry.value > 0);

  // Calculate completion percentage
  const completionPercentage =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="progress-tooltip">
          <p>{`${payload[0].name}: ${payload[0].value} task${
            payload[0].value !== 1 ? "s" : ""
          }`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="progress-card">
      <div className="progress-header">
        <h2>Task Progress</h2>
        <div className="progress-percentage">
          <span className="percentage-text">{completionPercentage}%</span>
          <span className="percentage-label">completed</span>
        </div>
      </div>

      <div className="progress-body">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{total - completed}</span>
            <span className="stat-label">Remaining</span>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              {filteredData.length > 0 && (
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {filteredData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
              )}
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="chart-legend">
            {data.map((entry, index) => (
              <div className="legend-item" key={`legend-${index}`}>
                <span
                  className="legend-color"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span className="legend-text">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Homepage component with task progress tracker
 */
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
        <TaskProgressTracker completed={completedCount} total={totalTasks} />
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
