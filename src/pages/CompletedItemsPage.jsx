import "../App.css";
import Spacer from "../utils/Spacer";
import "../styles/Common.css";
import "../styles/TodoItems.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTodosByCompletion,
  selectCompletedTodos,
  selectTodoStatus,
  selectTodoError,
} from "../state/todoSlice";

/**
 * Displays a single completed todo item
 *
 * @param {Object} item - Completed todo item with heading and body
 * @param {boolean} isLast - Flag to determine if spacer should be shown
 * @returns {JSX.Element} The rendered completed todo item
 */
const CompletedTodoItem = ({ item, isLast }) => {
  const completionDate = new Date().toLocaleDateString();

  return (
    <div className="todo-card completed">
      <h3 className="todo-card-title">{item.heading}</h3>
      <p className="todo-card-content">{item.body}</p>
      <div className="todo-card-footer">
        <span className="todo-date">Completed on {completionDate}</span>
        <span className="todo-status completed">Completed</span>
      </div>
      {!isLast && <Spacer height="20px" />}
    </div>
  );
};

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

  /**
   * Fetch completed todos on component mount
   * Only fetches if status is idle to prevent duplicate requests
   */
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodosByCompletion(true));
    }
  }, [status, dispatch]);

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

      <div className="todo-list">
        {status === "loading" && (
          <div className="todo-loading">
            <div className="loader"></div>
            <p>Loading your completed tasks...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="todo-error">
            <p>Error: {error}</p>
            <button
              className="todo-button"
              onClick={() => dispatch(fetchTodosByCompletion(true))}
            >
              Try Again
            </button>
          </div>
        )}

        {status === "succeeded" && completedItems.length === 0 && (
          <div className="todo-empty">
            <div className="todo-empty-icon">🎯</div>
            <p>You haven't completed any tasks yet.</p>
            <p className="todo-empty-subtitle">
              Complete tasks from your to-do list to see them here.
            </p>
          </div>
        )}

        {status === "succeeded" &&
          completedItems.length > 0 &&
          completedItems.map((item, i) => (
            <CompletedTodoItem
              key={item.id}
              item={item}
              isLast={i === completedItems.length - 1}
            />
          ))}
      </div>
    </div>
  );
};

export default CompletedItemsPage;
