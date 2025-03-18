import "../App.css";
import Spacer from "../utils/Spacer";
import "../styles/Common.css";
import "../styles/TodoItems.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodosByCompletion,
  selectIncompleteTodos,
  selectTodoStatus,
  selectTodoError,
} from "../state/todoSlice";

/**
 * Displays a single todo item with heading and content
 *
 * @param {Object} item - Todo item with heading and body
 * @param {boolean} isLast - Flag to determine if spacer should be shown
 * @returns {JSX.Element} The rendered todo item
 */
const TodoItem = ({ item, isLast }) => {
  return (
    <div className="todo-card">
      <h3 className="todo-card-title">{item.heading}</h3>
      <p className="todo-card-content">{item.body}</p>
      <div className="todo-card-footer">
        <span className="todo-status">
          {item.isComplete ? "Completed" : "In Progress"}
        </span>
      </div>
      {!isLast && <Spacer height="20px" />}
    </div>
  );
};

/**
 * Renders the to-do list page displaying incomplete items using Redux
 *
 * @returns {JSX.Element} - Rendered to-do list page component
 */
export const ToDoItemsPage = () => {
  const dispatch = useDispatch();
  const todoItems = useSelector(selectIncompleteTodos);
  const status = useSelector(selectTodoStatus);
  const error = useSelector(selectTodoError);

  /**
   * Fetches incomplete todos on component mount
   * Only fetches if status is idle to prevent duplicate requests
   */
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodosByCompletion(false));
    }
  }, [status, dispatch]);

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1 className="todo-title">My Tasks</h1>
      </div>

      <div className="todo-list">
        {status === "loading" && (
          <div className="todo-loading">
            <div className="loader"></div>
            <p>Loading your tasks...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="todo-error">
            <p>Error: {error}</p>
            <button
              className="todo-button"
              onClick={() => dispatch(fetchTodosByCompletion(false))}
            >
              Try Again
            </button>
          </div>
        )}

        {status === "succeeded" && todoItems.length === 0 && (
          <div className="todo-empty">
            <div className="todo-empty-icon">📝</div>
            <p>No to-do items found. Add some tasks to get started!</p>
          </div>
        )}

        {status === "succeeded" &&
          todoItems.length > 0 &&
          todoItems.map((item, i) => (
            <TodoItem
              key={item.id}
              item={item}
              isLast={i === todoItems.length - 1}
            />
          ))}
      </div>
    </div>
  );
};

export default ToDoItemsPage;
