import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { HomePage } from "../../pages/HomePage";
import todoReducer from "../../state/todoSlice";

// Mock ResizeObserver as Jest does not support it by default
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("HomePage", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: {
          todos: [],
          status: "idle",
          error: null,
        },
      },
    });
  });

  test("renders welcome message", () => {
    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    expect(screen.getByText(/Welcome to TaskFlow/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Your personal task management dashboard/i)
    ).toBeInTheDocument();
  });

  test("renders empty state when there are no tasks", () => {
    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Get started by creating your first task/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Get Started/i })
    ).toBeInTheDocument();
  });

  test("renders ProgressTracker when tasks are present", () => {
    store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: {
          todos: [
            {
              id: 1,
              heading: "Task 1",
              body: "Description 1",
              isComplete: true,
            },
            {
              id: 2,
              heading: "Task 2",
              body: "Description 2",
              isComplete: false,
            },
          ],
          status: "idle",
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    expect(screen.getByText(/Progress Tracker/i)).toBeInTheDocument();
  });

  test("calculates and displays correct completion percentage", () => {
    store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: {
          todos: [
            { id: 1, isComplete: true },
            { id: 2, isComplete: true },
            { id: 3, isComplete: false },
            { id: 4, isComplete: false },
          ],
          status: "idle",
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    const percentageElements = screen.getAllByText(/50%/i);
    expect(percentageElements.length).toBeGreaterThan(0);
  });

  test("displays 0% progress when there are no completed tasks", () => {
    store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: {
          todos: [
            { id: 1, isComplete: false },
            { id: 2, isComplete: false },
          ],
          status: "idle",
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    const percentageElements = screen.getAllByText(/0%/i);
    expect(percentageElements.length).toBeGreaterThan(0);
  });

  test("renders correct count of total and completed tasks", () => {
    // Define test data
    const testTodos = [
      { id: 1, heading: "Task 1", isComplete: true },
      { id: 2, heading: "Task 2", isComplete: false },
      { id: 3, heading: "Task 3", isComplete: false },
    ];

    const totalTasks = testTodos.length;
    const completedTasks = testTodos.filter((todo) => todo.isComplete).length;

    store = configureStore({
      reducer: { todos: todoReducer },
      preloadedState: {
        todos: { todos: testTodos, status: "idle", error: null },
      },
    });

    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    // Use screen.getByText to search for numbers directly
    expect(screen.getByText(totalTasks.toString())).toBeInTheDocument();
    expect(screen.getByText(completedTasks.toString())).toBeInTheDocument();
  });
});
