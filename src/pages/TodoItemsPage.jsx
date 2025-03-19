import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodos,
  fetchTodosByCompletion,
  selectAllTodos,
  selectIncompleteTodos,
  selectCompletedTodos,
  selectTodoStatus,
  selectTodoError,
} from "../state/todoSlice";
import CreateTodoForm from "../components/CreateTodoForm";
import TodoItem from "../components/TodoItem";
import "../styles/TodoItems.css";

/**
 * Renders the main todo page with tabs, filtering and card grid layout
 *
 * @returns {JSX.Element} - Rendered todo page component
 */
const ToDoItemsPage = () => {
  const dispatch = useDispatch();

  // Selectors for different todo lists
  const allTodos = useSelector(selectAllTodos);
  const activeTodos = useSelector(selectIncompleteTodos);
  const completedTodos = useSelector(selectCompletedTodos);
  const status = useSelector(selectTodoStatus);
  const error = useSelector(selectTodoError);

  // State for UI
  const [activeTab, setActiveTab] = useState("all"); // all, active, completed
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, alphabetical
  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(true);

  /**
   * Fetch todos based on the active tab
   */
  const fetchTodoData = useCallback(() => {
    if (shouldFetch) {
      if (activeTab === "all") {
        dispatch(fetchTodos());
      } else if (activeTab === "active") {
        dispatch(fetchTodosByCompletion(false));
      } else if (activeTab === "completed") {
        dispatch(fetchTodosByCompletion(true));
      }
      setShouldFetch(false);
    }
  }, [dispatch, activeTab, shouldFetch]);

  /**
   * Initial data fetching on component mount
   */
  useEffect(() => {
    fetchTodoData();
  }, [fetchTodoData]);

  /**
   * Handle status changes
   */
  useEffect(() => {
    if (status === "succeeded" && isInitialLoading) {
      setIsInitialLoading(false);
    }

    if (status === "failed") {
      setShouldFetch(true);
    }
  }, [status, isInitialLoading]);

  /**
   * Handle tab changes
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShouldFetch(true);
  };

  /**
   * Handle todo updates (add, edit, delete, status change)
   */
  const handleTodoChanged = useCallback(() => {
    setShouldFetch(true);
    fetchTodoData();
  }, [fetchTodoData]);

  /**
   * Toggle create form visibility
   */
  const toggleCreateForm = () => {
    setIsCreateFormVisible(!isCreateFormVisible);
  };

  /**
   * Filter and sort todos based on current filters
   */
  const getFilteredAndSortedTodos = () => {
    // Determine which todo list to use based on active tab
    let todosToShow = [];
    if (activeTab === "all") todosToShow = allTodos;
    else if (activeTab === "active") todosToShow = activeTodos;
    else if (activeTab === "completed") todosToShow = completedTodos;

    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      todosToShow = todosToShow.filter(
        (todo) =>
          todo.heading.toLowerCase().includes(term) ||
          todo.body.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    return [...todosToShow].sort((a, b) => {
      if (sortBy === "alphabetical") {
        return a.heading.localeCompare(b.heading);
      } else if (sortBy === "oldest") {
        // Assuming each todo has an id that roughly corresponds to creation order
        return a.id - b.id;
      } else {
        // newest first
        return b.id - a.id;
      }
    });
  };

  // Get the filtered and sorted todos
  const filteredTodos = getFilteredAndSortedTodos();

  // Determine the page title based on the active tab
  const getPageTitle = () => {
    if (activeTab === "all") return "All Tasks";
    if (activeTab === "active") return "Active Tasks";
    return "Completed Tasks";
  };

  // Render the appropriate content based on loading/error states
  const renderContent = () => {
    if (status === "loading" && isInitialLoading) {
      return (
        <div className="todo-loading">
          <div className="loader"></div>
          <p>Loading your tasks...</p>
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="todo-error">
          <p>Error: {error}</p>
          <button className="todo-button" onClick={() => setShouldFetch(true)}>
            Try Again
          </button>
        </div>
      );
    }

    if (filteredTodos.length === 0) {
      return (
        <div className="todo-empty">
          <div className="todo-empty-icon">📝</div>
          <p>
            {searchTerm
              ? "No tasks match your search"
              : activeTab === "completed"
              ? "You haven't completed any tasks yet"
              : activeTab === "active"
              ? "No active tasks found"
              : "No tasks found. Create one to get started!"}
          </p>
        </div>
      );
    }

    return (
      <div className="todo-grid">
        {filteredTodos.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onTodoUpdated={handleTodoChanged}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1 className="todo-title">{getPageTitle()}</h1>
        {filteredTodos.length > 0 && (
          <p className="todo-subtitle">
            {filteredTodos.length} task{filteredTodos.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="todo-tabs">
        <div
          className={`todo-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All Tasks
        </div>
        <div
          className={`todo-tab ${activeTab === "active" ? "active" : ""}`}
          onClick={() => handleTabChange("active")}
        >
          Active
        </div>
        <div
          className={`todo-tab ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => handleTabChange("completed")}
        >
          Completed
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>

        <button className="create-todo-button" onClick={toggleCreateForm}>
          <span className="create-todo-icon">+</span>
          <span>Create Task</span>
        </button>
      </div>

      {/* Create Todo Form */}
      {isCreateFormVisible && (
        <CreateTodoForm
          onTodoAdded={handleTodoChanged}
          onCancel={toggleCreateForm}
        />
      )}

      {/* Todo List Content */}
      {renderContent()}
    </div>
  );
};

export default ToDoItemsPage;
