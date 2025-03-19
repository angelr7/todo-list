import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";
import "../styles/HomePage.css";

const ProgressTracker = ({ completed, total }) => {
  // Ensure valid numbers (handle NaN, undefined, null, and negative values)
  const validTotal = isNaN(total) || total < 0 ? 0 : total;
  const validCompleted = isNaN(completed) || completed < 0 ? 0 : completed;
  const remaining = Math.max(validTotal - validCompleted, 0);

  // Calculate completion percentage safely
  const completionPercentage =
    validTotal > 0 ? Math.round((validCompleted / validTotal) * 100) : 0;

  // Handles edge case when there's no data
  if (validTotal === 0) {
    return (
      <div className="progress-card">
        <div className="progress-header">
          <h2>Progress Tracker</h2>
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

  // Data for the pie chart
  const data = [
    { name: "Completed", value: validCompleted, color: "var(--success)" },
    { name: "To Do", value: remaining, color: "var(--divider)" },
  ];

  // Filter out any entries with zero value to prevent chart rendering issues
  const filteredData = data.filter((entry) => entry.value > 0);

  // Legend component showing both numbers and percentages
  const Legend = () => {
    return (
      <div className="chart-legend" data-testid="legend-section">
        <div className="legend-title">Task Distribution</div>
        <div className="legend-items-container">
          {data.map((entry, index) => {
            const itemPercentage = validTotal
              ? Math.round((entry.value / validTotal) * 100)
              : 0;
            return (
              <div className="legend-item" key={`legend-${index}`}>
                <div className="legend-header">
                  <span
                    className="legend-color"
                    style={{ backgroundColor: entry.color }}
                  ></span>
                  <span className="legend-text">{entry.name}</span>
                </div>
                <div className="legend-details">
                  <span className="legend-value">
                    {entry.value} task{entry.value !== 1 ? "s" : ""}
                  </span>
                  <span className="legend-percentage">({itemPercentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="progress-card">
      <div className="progress-header">
        <h2>Progress Tracker</h2>
        <div className="progress-percentage">
          <span className="percentage-text">{completionPercentage}%</span>
          <span className="percentage-label">completed</span>
        </div>
      </div>

      <div className="progress-body">
        <div className="stats-grid" data-testid="stats-grid">
          <div className="stat-card">
            <span data-testid="total-tasks" className="stat-value">
              {validTotal}
            </span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card">
            <span data-testid="completed-tasks" className="stat-value">
              {validCompleted}
            </span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span data-testid="remaining-tasks" className="stat-value">
              {remaining}
            </span>
            <span className="stat-label">Remaining</span>
          </div>
        </div>

        <div className="chart-with-legend">
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
                    <Label
                      content={({ viewBox }) => {
                        const { cx, cy } = viewBox;
                        return (
                          <text
                            x={cx}
                            y={cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={cx}
                              y={cy - 5}
                              className="donut-label-value"
                              style={{
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                fill: "var(--text-primary)",
                              }}
                            >
                              {completionPercentage}%
                            </tspan>
                            <tspan
                              x={cx}
                              y={cy + 15}
                              style={{
                                fontSize: "0.75rem",
                                fill: "var(--text-secondary)",
                              }}
                            >
                              completed
                            </tspan>
                          </text>
                        );
                      }}
                    />
                  </Pie>
                )}
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <Legend />
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
