import React from "react";

const TodoTable = ({ title, todos, onEdit, onDelete, onFetch }) => {
  return (
    <div className="table-section">
      <h2>{title}</h2>

      {onFetch && (
        <button className="primary" onClick={onFetch}>
          Fetch Data
        </button>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <tr key={todo.id}>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.status}</td>
                <td className="table-actions">
                  <button className="edit" onClick={() => onEdit(todo)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => onDelete(todo.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TodoTable;
