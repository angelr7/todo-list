import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// reducer
import todosReducer from "../state/todoSlice";

// Custom render function to include Redux store
export function renderWithRedux(
  ui,
  {
    preloadedState = {}, // Set a preloaded state for the store
    store = configureStore({
      reducer: {
        todos: todosReducer, // Add the reducer to the store on render
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
