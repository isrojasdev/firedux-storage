import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { executeQueries } from "firedux-storage";
import TodoModal from "./components/TodoModal";
import TodoTable from "./components/TodoTable";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const todosRealTime = useSelector(
    (state) => state.firestore.collection.todosRealTime?.docs || []
  );
  const todosCollection = useSelector(
    (state) => state.firestore.collection.todosCollection?.docs || []
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

  const handleOpenModal = (todo = null) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTodo(null);
  };

  const handleSave = async (todo) => {
    setIsLoading(true);

    const results = await executeQueries([
      {
        queryType: selectedTodo ? "updateDocument" : "addDocument",
        collectionName: "todos",
        documentId: selectedTodo ? selectedTodo.id : undefined,
        documentData: todo,
      },
    ]);

    setIsLoading(false);

    const hasError = results.some((res) => res.status === "failed");

    if (hasError) {
      alert("Error saving the To-Do.");
    } else {
      alert("To-Do saved successfully!");
    }
  };

  const handleDelete = async (todoId) => {
    if (!window.confirm("Are you sure you want to delete this To-Do?")) return;

    setIsLoading(true);

    try {
      const results = await executeQueries([
        {
          queryType: "removeDocument",
          collectionName: "todos",
          documentId: todoId, // Asegurar que el ID se pasa correctamente
        },
      ]);

      setIsLoading(false);

      const hasError = results.some((res) => res.status === "failed");

      if (hasError) {
        alert("Error deleting the To-Do.");
      } else {
        alert("To-Do deleted successfully!");
      }
    } catch (error) {
      alert("An error occurred while deleting the To-Do.");
      setIsLoading(false);
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
      <h1>To-Do List</h1>

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
