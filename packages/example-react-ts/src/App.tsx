import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { executeQueries } from "firedux-storage";
import { TodoModal } from "./components/TodoModal";
import { TodoTable } from "./components/TodoTable";
import { AuthSection } from "./components/AuthSection";
import type { Todo, TodoInput } from "./types/todo";
import type { AppState } from "./store";
import "./App.css";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const todosRealTime = useSelector(
    (state: AppState) =>
      (state.firestore.collection.todosRealTime?.docs ?? []) as Todo[]
  );
  const todosCollection = useSelector(
    (state: AppState) =>
      (state.firestore.collection.todosCollection?.docs ?? []) as Todo[]
  );

  useEffect(() => {
    executeQueries([
      {
        queryType: "obtainRealTime",
        collectionName: "todos",
        storeAs: "todosRealTime",
      },
    ]);
  }, []);

  const handleOpenModal = (todo: Todo | null = null) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const handleSave = async (todoData: TodoInput) => {
    setIsLoading(true);
    const results = await executeQueries([
      {
        queryType: selectedTodo ? "updateDocument" : "addDocument",
        collectionName: "todos",
        documentId: selectedTodo?.id,
        documentData: todoData,
      },
    ]);
    setIsLoading(false);
    if (results.some((res: { status: string }) => res.status === "failed")) {
      alert("Error saving the To-Do.");
    } else {
      alert("To-Do saved successfully!");
    }
  };

  const handleDelete = async (todoId: string) => {
    if (!window.confirm("Are you sure you want to delete this To-Do?")) return;
    setIsLoading(true);
    const results = await executeQueries([
      {
        queryType: "removeDocument",
        collectionName: "todos",
        documentId: todoId,
      },
    ]);
    setIsLoading(false);
    if (results.some((res: { status: string }) => res.status === "failed")) {
      alert("Error deleting the To-Do.");
    }
  };

  const fetchCollectionData = () => {
    executeQueries([
      {
        queryType: "getCollectionData",
        collectionName: "todos",
        storeAs: "todosCollection",
      },
    ]);
  };

  return (
    <div className="App">
      <h1>To-Do List (TypeScript)</h1>

      <AuthSection />

      {isLoading && <div className="loader">Loading...</div>}

      <button onClick={() => handleOpenModal()} disabled={isLoading}>
        {isLoading ? "Processing..." : "Add New To-Do"}
      </button>

      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={selectedTodo}
      />

      <div className="tables-container">
        <TodoTable
          title="Real-Time Todos"
          todos={todosRealTime}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
        <TodoTable
          title="Collection Fetch Todos"
          todos={todosCollection}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          onFetch={fetchCollectionData}
        />
      </div>
    </div>
  );
};

export default App;
