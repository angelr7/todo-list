import React from "react";
import { render, screen, within } from "@testing-library/react";
import ProgressTracker from "../../components/ProgressTracker";

/**
 * Mock for Recharts components to prevent rendering errors in tests
 */
jest.mock("recharts", () => ({
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  Tooltip: () => <div data-testid="tooltip" />,
  Label: () => <div data-testid="label" />,
}));

describe("ProgressTracker", () => {
  const renderComponent = (completed, total) => {
    render(<ProgressTracker completed={completed} total={total} />);
  };

  const calculatePercentage = (completed, total) => {
    if (!total || isNaN(completed) || isNaN(total)) return "0%";
    return `${Math.round((completed / total) * 100)}%`;
  };

  test("renders correctly when there are no tasks", () => {
    const completed = 0,
      total = 0;
    renderComponent(completed, total);

    expect(screen.getByText(/Progress Tracker/i)).toBeInTheDocument();
    expect(
      screen.getByText(calculatePercentage(completed, total))
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Add tasks to see your progress/i)
    ).toBeInTheDocument();
  });

  test("renders correct progress percentage when tasks exist", () => {
    const completed = 3,
      total = 6;
    renderComponent(completed, total);

    expect(screen.getByText(/Progress Tracker/i)).toBeInTheDocument();
    expect(
      screen.getByText(calculatePercentage(completed, total))
    ).toBeInTheDocument();

    const statsGrid = screen.getByTestId("stats-grid");

    expect(within(statsGrid).getByText(/Completed/i)).toBeInTheDocument();
    expect(screen.getByTestId("completed-tasks")).toHaveTextContent(
      completed.toString()
    );
    expect(screen.getByTestId("total-tasks")).toHaveTextContent(
      total.toString()
    );
    expect(screen.getByTestId("remaining-tasks")).toHaveTextContent(
      (total - completed).toString()
    );
  });

  test("renders correct progress for 100% completion", () => {
    const completed = 5,
      total = 5;
    renderComponent(completed, total);

    expect(
      screen.getByText(calculatePercentage(completed, total))
    ).toBeInTheDocument();
    expect(screen.getByTestId("remaining-tasks")).toHaveTextContent("0");
  });

  test("renders correct progress for 0% completion", () => {
    const completed = 0,
      total = 4;
    renderComponent(completed, total);

    expect(
      screen.getByText(calculatePercentage(completed, total))
    ).toBeInTheDocument();
    expect(screen.getByTestId("completed-tasks")).toHaveTextContent(
      completed.toString()
    );
    expect(screen.getByTestId("remaining-tasks")).toHaveTextContent(
      total.toString()
    );
  });

  test("renders PieChart and legend correctly when tasks exist", () => {
    const completed = 2,
      total = 5;
    renderComponent(completed, total);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie")).toBeInTheDocument();
    expect(screen.getAllByTestId("cell")).toHaveLength(2);

    const legendSection = screen.getByTestId("legend-section");

    expect(within(legendSection).getByText(/Completed/i)).toBeInTheDocument();
    expect(within(legendSection).getByText(/To Do/i)).toBeInTheDocument();
    expect(
      within(legendSection).getByText(`${completed} tasks`)
    ).toBeInTheDocument();
    expect(
      within(legendSection).getByText(`${total - completed} tasks`)
    ).toBeInTheDocument();
  });

  test("handles invalid numbers gracefully", () => {
    const completed = NaN,
      total = NaN;
    renderComponent(completed, total);

    // Ensure it displays the "no data" state
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(
      screen.getByText(/Add tasks to see your progress/i)
    ).toBeInTheDocument();

    // Ensure stats-grid does not exist since there are no tasks
    expect(screen.queryByTestId("stats-grid")).not.toBeInTheDocument();
  });
});
