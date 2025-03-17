import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

/**
 * Fetches all todo items from the API
 * @returns {Promise<Array>} Promise that resolves to an array of todo items
 */
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async () => {
    const response = await axios.get('http://localhost:3001/items');
    return response.data;
  }
);

/**
 * Fetches todo items filtered by completion status
 * @param {boolean} isComplete - Shows whether the todo is complete or not using true or false
 * @returns {Promise<Array>} Promise that resolves to filtered todo items
 */
export const fetchTodosByCompletion = createAsyncThunk(
  'todos/fetchTodosByCompletion',
  async (isComplete) => {
    const response = await axios.get(`http://localhost:3001/items?isComplete=${isComplete}`);
    return response.data;
  }
);

/**
 * Creates a new todo item
 * @param {Object} todoData - The data for the new todo
 * @param {string} todoData.heading - The title/heading of the todo
 * @param {string} todoData.body - The description/body content of the todo
 * @returns {Promise<Object>} Promise that resolves to the created todo item
 */
export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData) => {
    const response = await axios.post('http://localhost:3001/items', {
      ...todoData,
      isComplete: false
    });
    return response.data;
  }
);

/**
 * Updates an existing todo item
 * @param {Object} todoData - The updated todo data
 * @param {number|string} todoData.id - The ID of the todo to update
 * @param {string} [todoData.heading] - The updated title/heading
 * @param {string} [todoData.body] - The updated description/body
 * @param {boolean} [todoData.isComplete] - The updated completion status
 * @returns {Promise<Object>} Promise that resolves to the updated todo item
 */
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todoData) => {
    const response = await axios.put(`http://localhost:3001/items/${todoData.id}`, todoData);
    return response.data;
  }
);

/**
 * Toggles the completion status of a todo item
 * @param {Object} todo - The todo item to toggle
 * @param {number|string} todo.id - The ID of the todo
 * @param {boolean} todo.isComplete - The current completion status (will be toggled)
 * @returns {Promise<Object>} Promise that resolves to the updated todo item
 */
export const toggleTodoCompletion = createAsyncThunk(
  'todos/toggleTodoCompletion',
  async (todo) => {
    const response = await axios.put(`http://localhost:3001/items/${todo.id}`, {
      ...todo,
      isComplete: !todo.isComplete
    });
    return response.data;
  }
);

/**
 * Deletes a todo item
 * @param {number|string} id - The ID of the todo to delete
 * @returns {Promise<number|string>} Promise that resolves to the ID of the deleted todo
 */
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id) => {
    await axios.delete(`http://localhost:3001/items/${id}`);
    return id;
  }
);

/**
 * @typedef {Object} TodoState
 * @property {Array} todos - Array of todo items
 * @property {'idle'|'loading'|'succeeded'|'failed'} status - Current status of API requests
 * @property {string|null} error - Error message if any
 */

/**
 * Initial state for the todos slice
 * @type {TodoState}
 */
const initialState = {
  todos: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

/**
 * Redux slice for todo operations
 */
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    /**
     * Clears all todos from the state
     * @param {TodoState} state - The current state
     */
    clearTodos: (state) => {
      state.todos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTodos
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // fetchTodosByCompletion
      .addCase(fetchTodosByCompletion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodosByCompletion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(fetchTodosByCompletion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // addTodo
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      
      // updateTodo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      
      // toggleTodoCompletion
      .addCase(toggleTodoCompletion.fulfilled, (state, action) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      
      // deleteTodo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      });
  },
});

// Export actions
export const { clearTodos } = todoSlice.actions;

/**
 * Selects all todos from the state
 * @param {Object} state - The root state
 * @returns {Array} All todo items
 */
export const selectAllTodos = (state) => state.todos.todos;

/**
 * Selects a specific todo by ID
 * @param {Object} state - The root state
 * @param {number|string} todoId - The ID of the todo to select
 * @returns {Object|undefined} The todo item or undefined if not found
 */
export const selectTodoById = (state, todoId) => 
  state.todos.todos.find(todo => todo.id === todoId);

/**
 * Selects all completed todos
 * @param {Object} state - The root state
 * @returns {Array} Completed todo items
 */
export const selectCompletedTodos = (state) => 
  state.todos.todos.filter(todo => todo.isComplete);

/**
 * Selects all incomplete todos
 * @param {Object} state - The root state
 * @returns {Array} Incomplete todo items
 */
export const selectIncompleteTodos = (state) => 
  state.todos.todos.filter(todo => !todo.isComplete);

/**
 * Selects the current API request status
 * @param {Object} state - The root state
 * @returns {'idle'|'loading'|'succeeded'|'failed'} Current status
 */
export const selectTodoStatus = (state) => state.todos.status;

/**
 * Selects any error message from the state
 * @param {Object} state - The root state
 * @returns {string|null} Error message if any
 */
export const selectTodoError = (state) => state.todos.error;

// Export reducer
export default todoSlice.reducer;