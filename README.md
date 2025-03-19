# Todo Dashboard

## Overview

Todo Dashboard (TaskFlow) is a modern task management application built with React and Redux, offering an intuitive interface for creating, organizing, and tracking tasks. The app features a responsive design, accessibility support, and smooth UI interactions.

For a detailed guide on setting up and using this project, please refer to [INSTRUCTIONS.md](./INSTRUCTIONS.md). Additionally, the project's workflow is managed through [Github projects](https://github.com/users/puritybirir/projects/4).

## Features

- **Task Management**: Create, edit, delete, and mark tasks as complete.
- **Filtering & Sorting**: Filter tasks by status and sort them efficiently.
- **Search**: Find tasks using a built-in search functionality.
- **Responsive UI**: Optimized for desktop and mobile devices.
- **Dark Mode**: Toggle between light and dark themes.
- **Accessibility**: Keyboard navigation, ARIA attributes, and screen reader support.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 14.x)
- npm (or yarn)

### Installation

1. Clone the repository:

   ```sh
   git clone git@github.com:puritybirir/todo-list.git
   ```

2. Navigate into the project directory:

   ```sh
   cd todo-list
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Start the app which also starts the jdon server:

   ```sh
   npm start
   ```

5. Open the app in your browser or postman at `http://localhost:3000`.

## API Endpoints

The application interacts with a JSON Server running at `http://localhost:3001`:

- `GET /items` → Fetch all to-do items.
- `POST /items` → Add a new to-do item.
- `PUT /items/:id` → Update a to-do item.
- `DELETE /items/:id` → Remove a to-do item.

## Customization

Modify CSS variables in the `:root` selector and DesignSystem.css to customize:

- Colors
- Typography
- Spacing
- Shadows
- Transitions

## Future Enhancements

- Task categories and tags
- Due dates and reminders
- Drag-and-drop task reordering
- Collaboration features
- Data export/import
- Offline support with local storage

---
