import TodoList from "./todos/TodoList";

// Server Component — renders the shell; data fetching happens client-side
// via firedux-storage real-time listener in TodoList.
export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.4rem" }}>firedux-storage — Next.js (App Router)</h1>
      <TodoList />
    </main>
  );
}
