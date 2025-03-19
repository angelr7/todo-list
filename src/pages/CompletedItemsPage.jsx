import "../App.css";
import "../styles/Common.css";
import "../styles/TodoItems.css";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodosByCompletion,
  selectCompletedTodos,
  selectTodoStatus,
  selectTodoError,
} from "../state/todoSlice";
import TodoItem from "../components/TodoItem";

/**
 * Renders the completed items page with a modern UI
 *
 * @returns {JSX.Element} - Rendered completed items page component
 */
export const CompletedItemsPage = () => {
  const dispatch = useDispatch();
  const completedItems = useSelector(selectCompletedTodos);
  const status = useSelector(selectTodoStatus);
  const error = useSelector(selectTodoError);

  // Track if we need to fetch data
  const [shouldFetch, setShouldFetch] = useState(true);
  // Track if initial loading is happening
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  /**
   * Fetch completed todos function we can reuse
   */
  const fetchCompletedTodos = useCallback(() => {
    if (shouldFetch) {
      dispatch(fetchTodosByCompletion(true));
      setShouldFetch(false);
    }
  }, [dispatch, shouldFetch]);

  /**
   * Initial data fetching on component mount
   */
  useEffect(() => {
    fetchCompletedTodos();
  }, [fetchCompletedTodos]);

  /**
   * Handle status changes
   */
  useEffect(() => {
    // Once the initial load completes, update our flag
    if (status === "succeeded" && isInitialLoading) {
      setIsInitialLoading(false);
    }

    // If we have an error, allow refetching
    if (status === "failed") {
      setShouldFetch(true);
    }
  }, [status, isInitialLoading]);

  /**
   * Callback for when a todo is updated or deleted
   */
  const handleTodoChanged = useCallback(() => {
    setShouldFetch(true);
    fetchCompletedTodos();
  }, [fetchCompletedTodos]);

  /**
   * Manual refresh handler
   */
  const handleRefresh = () => {
    setShouldFetch(true);
    fetchCompletedTodos();
  };

  // Determine the appropriate content to render
  const renderContent = () => {
    if (status === "loading" && isInitialLoading) {
      return (
        <div className="todo-loading">
          <div className="loader"></div>
          <p>Loading your completed tasks...</p>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="todo-error">
          <p>Error: {error}</p>
          <button className="todo-button" onClick={handleRefresh}>
            Try Again
          </button>
        </div>
      );
    }

    if (status === "succeeded" && completedItems.length === 0) {
      return (
        <div className="todo-empty">
          <div className="todo-empty-icon">🎯</div>
          <p>You haven't completed any tasks yet.</p>
          <p className="todo-empty-subtitle">
            Complete tasks from your to-do list to see them here.
          </p>
        </div>
      );
    }

    // We have items, show them in a grid
    return (
      <div className="todo-list">
        {completedItems.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            isLast={false} /* We don't need isLast with grid layout */
            onTodoUpdated={handleTodoChanged}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1 className="todo-title">Completed Tasks</h1>
        {completedItems.length > 0 && (
          <p className="todo-subtitle">
            You've completed {completedItems.length} task
            {completedItems.length !== 1 ? "s" : ""}. Great job!
          </p>
        )}
      </div>

      {/* Render the appropriate content */}
      {renderContent()}
    </div>
  );
};

export default CompletedItemsPage;
