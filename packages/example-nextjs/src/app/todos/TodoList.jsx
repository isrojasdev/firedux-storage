"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { executeQueries } from "firedux-storage";

export default function TodoList() {
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");

  const todos = useSelector((s) => s.firestore.collection.todos?.docs ?? []);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    executeQueries([{ queryType: "obtainRealTime", collectionName: "todos", storeAs: "todos" }]);
  }, []);

  async function addTodo() {
    const title = newTitle.trim();
    if (!title) return;
    setError("");

    const [res] = await executeQueries([
      { queryType: "addDocument", collectionName: "todos", documentData: { title, status: "pending" } },
    ]);

    if (res.status === "failed") {
      setError(res.error);
    } else {
      setNewTitle("");
    }
  }

  return (
    <div>
      {/* Auth */}
      <div style={{ marginBottom: "1rem" }}>
        {user ? (
          <span>
            {user.email} —{" "}
            <button onClick={() => executeQueries([{ queryType: "signOut" }])}>Sign out</button>
          </span>
        ) : (
          <button onClick={() => executeQueries([{ queryType: "signInGoogle" }])}>
            Sign in with Google
          </button>
        )}
      </div>

      {/* Add form */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="New todo title"
          style={{ flex: 1, padding: "0.4rem", border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

      {/* List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid #eee" }}>
            <span>{todo.title}</span>
            <button
              onClick={() =>
                executeQueries([{ queryType: "removeDocument", collectionName: "todos", documentId: todo.id }])
              }
            >
              Delete
            </button>
          </li>
        ))}
        {todos.length === 0 && <li style={{ color: "#888" }}>No todos yet.</li>}
      </ul>
    </div>
  );
}
