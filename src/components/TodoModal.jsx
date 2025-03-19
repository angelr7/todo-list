import React, { useEffect, useRef, useCallback, memo } from "react";
import PropTypes from "prop-types";

/**
 * Modal component for viewing full todo item details
 *
 */
const TodoModal = memo(
  ({ item, isOpen, onClose, onStatusChange, onEdit, onDelete }) => {
    const modalRef = useRef(null);

    // Memoized event handlers
    const handleStatusChange = useCallback(() => {
      onStatusChange(item);
      onClose();
    }, [item, onStatusChange, onClose]);

    const handleEdit = useCallback(() => {
      onEdit(item);
      onClose();
    }, [item, onEdit, onClose]);

    const handleDelete = useCallback(() => {
      onDelete(item);
      onClose();
    }, [item, onDelete, onClose]);

    // Handle escape key to close modal
    useEffect(() => {
      const handleEscKey = (e) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscKey);
        // Focus trap - ensure focus stays in the modal for accessibility
        document.body.style.overflow = "hidden"; // Prevent background scrolling
        return () => {
          document.removeEventListener("keydown", handleEscKey);
          document.body.style.overflow = ""; // Restore scrolling
        };
      }
    }, [isOpen, onClose]);

    // Handle click outside to close modal
    useEffect(() => {
      const handleOutsideClick = (e) => {
        if (
          modalRef.current &&
          !modalRef.current.contains(e.target) &&
          isOpen
        ) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
          document.removeEventListener("mousedown", handleOutsideClick);
      }
    }, [isOpen, onClose]);

    // Format date for display - memoized with useCallback for better performance
    const formatDate = useCallback((dateString) => {
      if (!dateString) return "N/A";

      try {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    }, []);

    if (!isOpen || !item) return null;

    // Split body content into paragraphs for proper rendering
    const paragraphs = item.body?.split("\n") || ["No content"];

    return (
      <div className="todo-modal-overlay" role="presentation">
        <div
          ref={modalRef}
          className={`todo-modal ${item.completed ? "completed" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>

          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">
              {item.heading}
            </h2>
            <div
              className={`modal-status ${
                item.completed ? "completed" : "active"
              }`}
            >
              {item.completed ? "Completed" : "Active"}
            </div>
          </div>

          <div className="modal-content">
            {paragraphs.map((paragraph, index) => (
              <p
                key={`para-${item.id}-${index}`}
                className="modal-content-paragraph"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="modal-footer">
            <div className="modal-metadata">
              <span>Created: {formatDate(item.created_at)}</span>
              {item.updated_at && (
                <span>Updated: {formatDate(item.updated_at)}</span>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-action-button status-toggle"
                onClick={handleStatusChange}
                aria-label={
                  item.completed ? "Mark as active" : "Mark as completed"
                }
              >
                <span className="button-icon">
                  {item.completed ? "↩" : "✓"}
                </span>
                <span>
                  {item.completed ? "Mark as Active" : "Mark as Completed"}
                </span>
              </button>

              <button
                type="button"
                className="modal-action-button edit"
                onClick={handleEdit}
                aria-label="Edit task"
              >
                <span className="button-icon">✎</span>
                <span>Edit</span>
              </button>

              <button
                type="button"
                className="modal-action-button delete"
                onClick={handleDelete}
                aria-label="Delete task"
              >
                <span className="button-icon">🗑</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Set display name for better debugging
TodoModal.displayName = "TodoModal";

// Enhanced PropTypes for better type checking
TodoModal.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    heading: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    completed: PropTypes.bool,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoModal;
