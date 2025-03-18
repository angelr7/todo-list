import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { CompletedItemsPage } from "../../pages/CompletedItemsPage";
import { fetchTodosByCompletion } from "../../state/todoSlice";

// Mock store setup
const mockStore = configureStore([]);

jest.mock("../../state/todoSlice", () => ({
  fetchTodosByCompletion: jest.fn(),
  selectCompletedTodos: (state) => state.todos,
  selectTodoStatus: (state) => state.status,
  selectTodoError: (state) => state.error,
}));

describe("CompletedItemsPage", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      todos: [],
      status: "idle",
      error: null,
    });
    store.dispatch = jest.fn();
  });

  test("dispatches fetchTodosByCompletion on mount if status is idle", () => {
    render(
      <Provider store={store}>
        <CompletedItemsPage />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(fetchTodosByCompletion(true));
  });

  test("renders loading state when status is loading", () => {
    store = mockStore({ todos: [], status: "loading", error: null });
    render(
      <Provider store={store}>
        <CompletedItemsPage />
      </Provider>
    );

    expect(
      screen.getByText(/Loading your completed tasks/i)
    ).toBeInTheDocument();
  });

  test("renders error message when status is failed", async () => {
    store = mockStore({ todos: [], status: "failed", error: "Network error" });
    render(
      <Provider store={store}>
        <CompletedItemsPage />
      </Provider>
    );

    expect(screen.getByText(/Error: Network error/i)).toBeInTheDocument();
    expect(screen.getByText(/Try Again/i)).toBeInTheDocument();
  });

  test("renders empty state when there are no completed tasks", () => {
    store = mockStore({ todos: [], status: "succeeded", error: null });
    render(
      <Provider store={store}>
        <CompletedItemsPage />
      </Provider>
    );

    expect(
      screen.getByText(/You haven't completed any tasks yet/i)
    ).toBeInTheDocument();
  });

  test("renders completed tasks when data is available", () => {
    const mockTodos = [
      { id: 1, heading: "Task 1", body: "Description 1" },
      { id: 2, heading: "Task 2", body: "Description 2" },
    ];
    store = mockStore({ todos: mockTodos, status: "succeeded", error: null });
    render(
      <Provider store={store}>
        <CompletedItemsPage />
      </Provider>
    );

    expect(screen.getByText(/Completed Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Task 2/i)).toBeInTheDocument();
  });
});
