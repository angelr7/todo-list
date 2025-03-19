# Getting started

This is a sample to-do list web-application that will be extended as part of your coding interview. Please read the notes below before you get started, and good luck!

Run `npm install` and `npm start` from the root of this directory to get started! Your tasks are defined in `INSTRUCTIONS.md`

**Make sure to fork this repository and add your final implementation to Github**. This is critical for code evaluation.

# Files

`src` contains all of our react code for this web app. For simplicity, we'll only discuss the files there.

All code in `src`, with the exception of the `pages` directory, configures the common logic that all of our routes/components are built from.

## Pages

This folder defines the pages that are rendered for the `Route` associated with each URL path. Inside we have source code and CSS for the following pages:

- Homepage
- To-do list
- Completed Tasks

## Interacting with the DB

We use json-server to create a mock server/DB based on the schema in `database/db.json`. You can perform CRUD operations on the DB using `axios`. Specifically, the following functions in `axios` represent the corresponding CRUD operations:

- Create: `axios.post`
- Read: `axios.get`
- Update: `axios.put`
- Delete: `axios.delete`

You can request all items in the DB by making a GET request to `http://localhost:3001/items`.

You can request _specific_ items in the DB by using query parameters, i.e. `http://localhost:3001/items?isComplete=false`.

## Interview Question Instructions

### Please read the README before beginning this activity

### Requirements

When implementing these tasks, you should follow basic CRUD principles, i.e.:

- Allow users to **create** new todo's.
- Allow users to **read** todo's (this is mainly completed for you already).
- Allow users to **update** existing todo's (i.e. change `isCompleted` to `true`).
- Allow users to **delete** todo's. (Should work for completed and non-completed items)

**Required:**

1. A progress tracker in the homepage - a pie chart showing the percentage of completed and to-do tasks.\*\*
   ![Local Image](./public/tracker.png)

2. Improve the UI/UX of the app! This is intentially left open-ended to give you an opportuninty to show off your skills!

   a. Some Ideas are:

   - Create list button to create different task groups with to-dos
   - ⁠Show the lists as a sidepanel
   - Add a progress tracking bar for each list
   - Add a calender to save and show the date and time when the to-do is created and completed
   - Filter starred items
   - Filter by date
   - Move completed items back to To-do

## Nice to have (bonus points, not required)

- The following tasks are nice to have and are **not** required for this activity. If you feel that your task is a bonus task, please explain. This can include, but is not limited to:

  - Improvements to functionality (i.e. an improvement or new feature you came up with on your own)

## Important Notes

Please keep the following rules in mind when completing this activity:

1. **Keep this question confidential**. Do not discuss and/or share the details of this question with anyone else.
2. **Each task requires some fullstack change**.

   a. If you add new field(s) to the schema, you need to make sure that the change is backwards-compatible with the original version. Make sure you're also filtering your queries appropriately.

   b. **If you are adding create, update, or delete logic, the user MUST have some way to trigger this via the UI.**

3. **Maintain reactive design**. The app should be readable and functional amongst a variety of different devices and screen sizes.
4. Ask for help anytime if something doesn't make sense or you become stuck.
