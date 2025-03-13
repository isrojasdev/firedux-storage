# Firedux Storage

[![NPM version](https://img.shields.io/npm/v/firedux-storage.svg)](https://www.npmjs.com/package/firedux-storage)
[![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://standardjs.com)
[![License](https://img.shields.io/github/license/YOUR_GITHUB_USERNAME/firedux-storage.svg)](https://github.com/isrojasdev/firedux-storage)


**Firedux Storage** is a library that simplifies the management of **Firestore** with **Redux Toolkit**. It enables **real-time queries** (`onSnapshot`) and **collection fetches** (`getDocs`), providing a modular approach for multiple frameworks.

## Installation

Install the library using **npm** or **yarn**:

```sh
npm install firedux-storage
# or
yarn add firedux-storage
```

## Features
Firedux Storage is designed to provide a seamless integration between **Firebase Firestore** and **Redux Toolkit**, making state management and Firestore interactions **faster, scalable, and easier**. Below are its key features:

---

## **Core Features**
### **1. Zero Configuration for Redux Store**
- No need to manually configure Redux; the library provides a pre-configured store that can be directly imported.

### **2. Real-Time Firestore Sync**
- Uses `onSnapshot` to sync Firestore collections **in real-time** with Redux state.
- Any change in Firestore is automatically updated in Redux.

### **3. Seamless Firestore CRUD Operations**
- **Insert, Update, Delete, and Fetch** documents without writing repetitive Firestore logic.
- Simplifies Firebase queries with a **single command** (`executeQueries`).

### **4. Flexible Query Handling**
- Supports **where conditions**, **ordering**, **limits**, and **custom store keys** (`storeAs`).
- Can **fetch data once** or **listen to real-time updates**.

---

## **Developer-Friendly Features**
### **5. Minimal Boilerplate Code**
- Eliminates the need to manually write Redux actions or reducers.
- Just call `executeQueries` and Firedux Storage handles the rest.

### **6. Works with Any JavaScript Framework**
- **Fully compatible with React, Next.js, Vue, Angular, and Vanilla JS.**
- Works with **Server-Side Rendering (SSR)**.

### **7. Scalable & Modular**
- Designed to support **multiple Firestore collections** at once.
- **Extensible architecture** to support future integrations.

---

## 🔄 **Built-in API Methods**
| Feature             | Description |
|---------------------|-------------|
| `addDocument` | Adds a new document to a Firestore collection. |
| `updateDocument` | Updates an existing Firestore document. |
| `deleteDocument` | Deletes a document from Firestore. |
| `obtainRealTime` | Fetches a collection in **real-time** and updates Redux state. |
| `getCollectionData` | Fetches a collection **once** without real-time updates. |
| `getDocumentById` | Retrieves a single document by ID. |

---

## **Performance Optimizations**
- Uses **Redux Toolkit’s createAsyncThunk** for asynchronous requests.  
- **Prevents redundant fetches** by caching Firestore state in Redux.  
- **Optimized Firestore queries** to reduce reads and improve speed.  

---

## **Why Use Firedux Storage?**
- **Saves Time** – No need to manually handle Firestore logic.  
- **Reduces Code Complexity** – No Redux boilerplate needed.  
- **Optimized for Real-Time Apps** – Best for chat apps, dashboards, and live updates.  
- **Works Out-of-the-Box** – Just initialize Firestore and start using it.  

---

## Usage Example in React
This example demonstrates how to **retrieve real-time data**, **fetch collections**, and **perform CRUD operations**.

### **Initialize Firebase in Your Project**
In your `index.js` or `main.js` file:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import FireduxStorage, { initializeFiredux } from "firedux-storage";

// Firebase Configuration
const userConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase & Firedux
initializeFiredux(userConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={FireduxStorage.store}>
    <App />
  </Provider>
);
```

---

### **Firedux Storage is Ready to Use**
With FireduxStorage, you do **not** need to configure Redux manually. The store is already provided by the library.

---

### **Add a Task (Insert / Update)**
```jsx
import { useState } from "react";
import { executeQueries } from "firedux-storage";

const TodoForm = ({ initialData, onSave }) => {
  const [todo, setTodo] = useState(initialData || { title: "", description: "", status: "pending" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryType = initialData ? "updateDocument" : "addDocument";

    const result = await executeQueries([
      {
        queryType,
        collectionName: "todos",
        documentId: initialData?.id,
        documentData: todo,
      },
    ]);

    if (result.some((res) => res.status === "failed")) {
      alert("Error saving the To-Do.");
    } else {
      alert("To-Do saved successfully!");
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={todo.title}
        onChange={(e) => setTodo({ ...todo, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={todo.description}
        onChange={(e) => setTodo({ ...todo, description: e.target.value })}
      />
      <select value={todo.status} onChange={(e) => setTodo({ ...todo, status: e.target.value })}>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default TodoForm;
```

---

### **Fetch Real-Time Data**
```jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { executeQueries } from "firedux-storage";

const RealTimeTodos = () => {
  const todos = useSelector((state) => state.firestore.collection.todosRealTime?.docs || []);

  useEffect(() => {
    executeQueries([
      {
        queryType: "obtainRealTime",
        collectionName: "todos",
        storeAs: "todosRealTime",
      },
    ]);
  }, []);

  return (
    <div>
      <h2>Real-Time Todos</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeTodos;
```

---

### **Delete a Task**
```jsx
const handleDelete = async (todoId) => {
  if (!window.confirm("Are you sure you want to delete this To-Do?")) return;

  const results = await executeQueries([
    {
      queryType: "deleteDocument",
      collectionName: "todos",
      documentId: todoId,
    },
  ]);

  if (results.some((res) => res.status === "failed")) {
    alert("Error deleting the To-Do.");
  } else {
    alert("To-Do deleted successfully!");
  }
};
```

---

### **Fetch a Collection**
```jsx
const fetchTodos = () => {
  executeQueries([
    {
      queryType: "getCollectionData",
      collectionName: "todos",
      storeAs: "todosCollection",
    },
  ]);
};
```

---

## **API - `executeQueries` Methods**
### **Add a Document**
```jsx
executeQueries([
  {
    queryType: "addDocument",
    collectionName: "todos",
    documentData: { title: "New Task", description: "Task description", status: "pending" },
  },
]);
```

### **Update a Document**
```jsx
executeQueries([
  {
    queryType: "updateDocument",
    collectionName: "todos",
    documentId: "documentId",
    documentData: { status: "completed" },
  },
]);
```

### **Delete a Document**
```jsx
executeQueries([
  {
    queryType: "deleteDocument",
    collectionName: "todos",
    documentId: "documentId",
  },
]);
```

### **Fetch Real-Time Data**
```jsx
executeQueries([
  {
    queryType: "obtainRealTime",
    collectionName: "todos",
    storeAs: "todosRealTime",
  },
]);
```

---

## Contributing
If you want to contribute, feel free to submit a pull request or open an issue on [GitHub](https://github.com/isrojasdev/firedux-storage)! 🚀

---

## License
MIT License - [View License](LICENSE)