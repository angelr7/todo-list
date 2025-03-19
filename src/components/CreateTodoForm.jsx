import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, selectTodoStatus } from "../state/todoSlice";
import "../styles/CreateTodoForm.css";

/**
 * Form component for creating new todo items
 * @param {Object} props Component props
 * @param {Function} props.onTodoAdded Optional callback for when a todo is added
 * @param {Function} props.onCancel Optional callback for when the form is cancelled
 * @returns {JSX.Element} The rendered form
 */
const CreateTodoForm = ({ onTodoAdded, onCancel }) => {
  const dispatch = useDispatch();
  const status = useSelector(selectTodoStatus);

  const [formData, setFormData] = useState({
    heading: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Clear success message after a delay
   */
  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage("");
        if (onCancel) onCancel(); // Close form on success
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [successMessage, onCancel]);

  /**
   * Handles input changes in the form
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  /**
   * Handles form submission
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.heading.trim() || !formData.body.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await dispatch(addTodo(formData)).unwrap();

      // Reset form after successful submission
      setFormData({
        heading: "",
        body: "",
      });

      // Show success message
      setSuccessMessage(`Task "${result.heading}" created successfully!`);

      // Call the callback if provided
      if (onTodoAdded && typeof onTodoAdded === "function") {
        onTodoAdded(result);
      }
    } catch (error) {
      console.error("Failed to create todo:", error);
      alert("Failed to create todo. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <div className="create-todo-form-container">
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <h2 className="create-todo-form-title">Create New Task</h2>

      <form onSubmit={handleSubmit} className="create-todo-form">
        <div className="form-group">
          <label htmlFor="heading" className="form-label">
            Task Title
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="body" className="form-label">
            Task Description
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Enter task description"
            rows="4"
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTodoForm;
