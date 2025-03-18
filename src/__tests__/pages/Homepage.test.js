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
  });

  test("renders TaskProgressTracker when tasks are present", () => {
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

    expect(screen.getByText(/Task Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Tasks/i)).toBeInTheDocument();
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

    expect(screen.getByText(/50%/i)).toBeInTheDocument();
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

    expect(screen.getByText(/0%/i)).toBeInTheDocument();
  });
});
