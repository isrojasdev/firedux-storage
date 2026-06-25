import { useState, useEffect } from "react";
import type { Todo, TodoInput } from "../types/todo";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TodoInput) => void;
  initialData: Todo | null;
}

export const TodoModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: TodoModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setStatus(initialData.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("pending");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, status });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? "Edit To-Do" : "Add To-Do"}</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label>Status:</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "pending" | "completed")
            }
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
