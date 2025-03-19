import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { ToDoItemsPage } from "../../pages/TodoItemsPage";

// Mock the Spacer component
jest.mock("../../utils/Spacer", () => {
  return function MockSpacer({ height }) {
    return <div data-testid="spacer" style={{ height }} />;
  };
});

// Mock the API calls directly at the module level
jest.mock("../../state/todoSlice", () => {
  const originalModule = jest.requireActual("../../state/todoSlice");

  return {
    ...originalModule,
    fetchTodosByCompletion: jest.fn(() => ({
      type: "todos/fetchTodosByCompletion/pending",
      meta: { arg: false },
    })),
  };
});

// Mock redux dispatch
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

// Mock Redux store
const mockStore = configureStore([]);

describe("ToDoItemsPage Component", () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    require("react-redux").useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    const store = mockStore({
      todos: {
        todos: [],
        status: "loading",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ToDoItemsPage />
      </Provider>
    );

    expect(screen.getByText(/loading your tasks/i)).toBeInTheDocument();
  });

  test("dispatches fetchTodosByCompletion when status is idle", () => {
    const store = mockStore({
      todos: {
        todos: [],
        status: "idle",
        error: null,
      },
    });

    // Import the fetchTodosByCompletion for this test
    const { fetchTodosByCompletion } = require("../../state/todoSlice");

    render(
      <Provider store={store}>
        <ToDoItemsPage />
      </Provider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(fetchTodosByCompletion(false));
  });

  test("does not dispatch fetchTodosByCompletion when status is not idle", () => {
    const store = mockStore({
      todos: {
        todos: [],
        status: "loading",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ToDoItemsPage />
      </Provider>
    );

    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  test("renders todo items when status is succeeded", () => {
    const todoItems = [
      {
        id: 1,
        heading: "Task 1",
        body: "Description 1",
        isComplete: false,
      },
      {
        id: 2,
        heading: "Task 2",
        body: "Description 2",
        isComplete: false,
      },
    ];

    const store = mockStore({
      todos: {
        todos: todoItems,
        status: "succeeded",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ToDoItemsPage />
      </Provider>
    );

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();

    // Check for spacer between items (but not after the last one)
    const spacers = screen.getAllByTestId("spacer");
    expect(spacers.length).toBe(1); // One spacer for the first item
  });

  test("renders empty state when no todo items exist", () => {
    const store = mockStore({
      todos: {
        todos: [],
        status: "succeeded",
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <ToDoItemsPage />
      </Provider>
    );

    expect(screen.getByText(/no to-do items found/i)).toBeInTheDocument();
    expect(screen.getByText("📝")).toBeInTheDocument(); // Check for the icon
  });

  test("renders error message on API failure", () => {
    const store = mockStore({
      todos: {
        todos: [],
        status: "failed",
        error: "Server error",
      },
    });

    render(
      <Provider store={store}>
        <ToDoItemsPage />
      </Provider>
    );

    expect(screen.getByText(/error: server error/i)).toBeInTheDocument();
    expect(screen.getByText(/try again/i)).toBeInTheDocument();
  });

  test("clicking 'Try Again' button dispatches fetchTodosByCompletion", () => {
    const store = mockStore({
      todos: {
        todos: [],
        status: "failed",
        error: "Server error",
      },
    });

    // Import the actual fetchTodosByCompletion for this test
    const { fetchTodosByCompletion } = require("../../state/todoSlice");

    render(
      <Provider store={store}>
        <ToDoItemsPage />
      </Provider>
    );

    fireEvent.click(screen.getByText(/try again/i));

    expect(mockDispatch).toHaveBeenCalledWith(fetchTodosByCompletion(false));
  });
});
