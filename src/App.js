import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchTodos } from "./state/todoSlice";
import logo from "./logo.svg";

// Pages
import { HomePage } from "./pages/HomePage";
import { ToDoItemsPage } from "./pages/TodoItemsPage";
import { CompletedItemsPage } from "./pages/CompletedItemsPage";

// Styles
import "./styles/DesignSystem.css";
import "./styles/Component.css";
import "./App.css";

const AppHeader = () => {
  // Toggle to light and dark mode
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <header className="app-header">
      <div className="container">
        <div className="header-container">
          <div className="app-branding">
            <NavLink to="/" className="logo">
              <img src={logo} className="App-logo" alt="React logo" />
              <span>TaskFlow</span>
            </NavLink>
          </div>

          <nav>
            <ul className="nav-menu">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/todos"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  To-do's
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/completed"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Completed
                </NavLink>
              </li>
              <li>
                <button
                  onClick={toggleTheme}
                  className="btn btn-tertiary btn-icon"
                  aria-label={`Switch to ${
                    theme === "light" ? "dark" : "light"
                  } mode`}
                >
                  {theme === "light" ? "🌙" : "☀️"}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

function App() {
  const dispatch = useDispatch();

  // Fetch todos when app loads
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="app-shell">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <AppHeader />

      <main id="main-content" className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<ToDoItemsPage />} />
          <Route path="/completed" element={<CompletedItemsPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
