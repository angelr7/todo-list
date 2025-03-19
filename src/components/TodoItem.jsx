import React, { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateTodo, deleteTodo } from "../state/todoSlice";
import TodoModal from "./TodoModal";

/**
 * Individual todo card
 *
 */
const TodoItem = memo(({ item, onTodoUpdated }) => {
  const dispatch = useDispatch();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    heading: item.heading,
    body: item.body,
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  /**
   * Toggle the completion status of a todo with useCallback for better performance
   */
  const handleStatusToggle = useCallback(() => {
    const updatedTodo = {
      ...item,
      // Here we need to map 'completed' to 'isComplete' for the API
      isComplete: !item.completed,
      updated_at: new Date().toISOString(),
    };

    dispatch(updateTodo(updatedTodo))
      .unwrap()
      .then(() => {
        onTodoUpdated();
      })
      .catch((error) => {
        console.error("Failed to update todo status:", error);
      });
  }, [dispatch, item, onTodoUpdated]);

  /**
   * Handle form input changes
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Save edited todo with useCallback
   */
  const handleSaveEdit = useCallback(() => {
    // Validate form data
    if (!editForm.heading.trim()) return;

    const updatedTodo = {
      ...item,
      heading: editForm.heading,
      body: editForm.body,
      // Make sure we preserve the isComplete property for the API
      isComplete: item.completed || item.isComplete,
      updated_at: new Date().toISOString(),
    };

    dispatch(updateTodo(updatedTodo))
      .unwrap()
      .then(() => {
        setIsEditing(false);
        onTodoUpdated();
      })
      .catch((error) => {
        console.error("Failed to update todo:", error);
      });
  }, [dispatch, editForm, item, onTodoUpdated]);

  /**
   * Delete a todo with useCallback
   */
  const handleDelete = useCallback(() => {
    dispatch(deleteTodo(item.id))
      .unwrap()
      .then(() => {
        setIsDeleteConfirmOpen(false);
        onTodoUpdated();
      })
      .catch((error) => {
        console.error("Failed to delete todo:", error);
      });
  }, [dispatch, item.id, onTodoUpdated]);

  /**
   * Open the modal with useCallback and event handling
   */
  const openModal = useCallback(
    (e) => {
      // Prevent opening modal when clicking action buttons
      if (
        e.target.closest(".todo-action-button") ||
        e.target.closest(".view-full-button") ||
        isEditing
      ) {
        return;
      }
      setIsModalOpen(true);
    },
    [isEditing]
  );

  /**
   * Handle edit button click from modal or card
   */
  const handleEditClick = useCallback(() => {
    // Reset form data to current item values
    setEditForm({
      heading: item.heading,
      body: item.body,
    });
    setIsEditing(true);
    setIsModalOpen(false);
  }, [item]);

  /**
   * Handle canceling edit mode
   */
  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    // Reset form data to original values
    setEditForm({
      heading: item.heading,
      body: item.body,
    });
  }, [item]);

  // Get the completion status, handling either property name
  const isCompleted =
    item.completed !== undefined ? item.completed : item.isComplete;

  // Conditional rendering for edit mode
  if (isEditing) {
    return (
      <div className="todo-card editing">
        <h3 className="edit-title">Edit Task</h3>

        <div className="edit-form">
          <div className="form-group">
            <label htmlFor={`edit-title-${item.id}`} className="form-label">
              Title
            </label>
            <input
              id={`edit-title-${item.id}`}
              name="heading"
              type="text"
              className="form-input"
              value={editForm.heading}
              onChange={handleInputChange}
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`edit-body-${item.id}`} className="form-label">
              Description
            </label>
            <textarea
              id={`edit-body-${item.id}`}
              name="body"
              className="form-textarea"
              rows="5"
              value={editForm.body}
              onChange={handleInputChange}
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div className="edit-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              type="button"
              className="save-button"
              onClick={handleSaveEdit}
              disabled={!editForm.heading.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conditional rendering for delete confirmation
  if (isDeleteConfirmOpen) {
    return (
      <div className="todo-card">
        <div className="delete-confirmation">
          <div className="delete-confirmation-dialog">
            <h4>Delete this task?</h4>
            <p className="delete-warning">This action cannot be undone.</p>
            <div className="delete-actions">
              <button
                type="button"
                className="cancel-delete"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="confirm-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Show the card content behind the delete confirmation */}
        <div className="todo-card-header">
          <h3 className="todo-card-title">{item.heading}</h3>
        </div>

        <div className="todo-card-content">{item.body}</div>

        <button
          type="button"
          className="view-full-button"
          aria-label="View full task details"
        >
          <span className="view-full-button-icon">👁️</span>
          <span>View Full</span>
        </button>

        <div className="todo-card-footer">
          <div className={`todo-status ${isCompleted ? "completed" : ""}`}>
            {isCompleted ? "Completed" : "Active"}
          </div>
          <div className="todo-created-date">
            {formatDate(item.created_at || new Date())}
          </div>
        </div>

        <div className="todo-action-buttons">
          <button
            type="button"
            className="todo-action-button status-toggle"
            onClick={handleStatusToggle}
          >
            {isCompleted ? "Mark Active" : "Mark Complete"}
          </button>

          <button
            type="button"
            className="todo-action-button edit"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>

          <button
            type="button"
            className="todo-action-button delete"
            onClick={() => setIsDeleteConfirmOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`todo-card ${isCompleted ? "completed" : ""}`}
        onClick={openModal}
      >
        <div className="todo-card-header">
          <h3 className="todo-card-title">{item.heading}</h3>
        </div>

        <div className="todo-card-content">{item.body}</div>

        <button
          type="button"
          className="view-full-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the card click event
            setIsModalOpen(true);
          }}
          aria-label="View full task details"
        >
          <span className="view-full-button-icon">👁️</span>
          <span>View Full</span>
        </button>

        <div className="todo-card-footer">
          <div className={`todo-status ${isCompleted ? "completed" : ""}`}>
            {isCompleted ? "Completed" : "Active"}
          </div>
          <div className="todo-created-date">
            {formatDate(item.created_at || new Date())}
          </div>
        </div>

        <div className="todo-action-buttons">
          <button
            type="button"
            className="todo-action-button status-toggle"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the card click event
              handleStatusToggle();
            }}
          >
            {isCompleted ? "Mark Active" : "Mark Complete"}
          </button>

          <button
            type="button"
            className="todo-action-button edit"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the card click event
              handleEditClick();
            }}
          >
            Edit
          </button>

          <button
            type="button"
            className="todo-action-button delete"
            onClick={(e) => {
              e.stopPropagation(); // Prevent the card click event
              setIsDeleteConfirmOpen(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal for viewing full task details - only rendered when open */}
      {isModalOpen && (
        <TodoModal
          item={{
            ...item,
            completed: isCompleted, // Ensure consistent property naming
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={handleStatusToggle}
          onEdit={handleEditClick}
          onDelete={() => {
            setIsModalOpen(false);
            setIsDeleteConfirmOpen(true);
          }}
        />
      )}
    </>
  );
});

// Component display name for better debugging
TodoItem.displayName = "TodoItem";

// PropTypes for type checking
TodoItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    completed: PropTypes.bool,
    isComplete: PropTypes.bool, // Added to support API property
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  onTodoUpdated: PropTypes.func.isRequired,
};

export default TodoItem;
