<template>
  <div class="app">
    <h1>firedux-storage — Vue 3</h1>

    <!-- Auth -->
    <div class="auth">
      <template v-if="user">
        <span>Signed in as <strong>{{ user.email }}</strong></span>
        <button @click="signOut">Sign out</button>
      </template>
      <template v-else>
        <button @click="signInGoogle">Sign in with Google</button>
      </template>
    </div>

    <!-- Add todo -->
    <div class="form">
      <input v-model="newTitle" placeholder="New todo title" @keydown.enter="addTodo" />
      <button @click="addTodo" :disabled="!newTitle.trim()">Add</button>
    </div>

    <!-- Error -->
    <p v-if="error" class="error">{{ error }}</p>

    <!-- List -->
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <span>{{ todo.title }}</span>
        <button @click="deleteTodo(todo.id)">Delete</button>
      </li>
      <li v-if="todos.length === 0">No todos yet.</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { executeQueries } from "firedux-storage";
import { useSelector } from "./useFiredux.js";

const newTitle = ref("");
const error = ref("");

// Reactive slices from the Redux store
const todos = useSelector((s) => s.firestore.collection.todos?.docs ?? []);
const user = useSelector((s) => s.auth.user);

onMounted(() => {
  executeQueries([{ queryType: "obtainRealTime", collectionName: "todos", storeAs: "todos" }]);
});

async function addTodo() {
  const title = newTitle.value.trim();
  if (!title) return;
  error.value = "";

  const [res] = await executeQueries([
    { queryType: "addDocument", collectionName: "todos", documentData: { title, status: "pending" } },
  ]);

  if (res.status === "failed") {
    error.value = res.error;
  } else {
    newTitle.value = "";
  }
}

async function deleteTodo(id) {
  await executeQueries([{ queryType: "removeDocument", collectionName: "todos", documentId: id }]);
}

function signInGoogle() {
  executeQueries([{ queryType: "signInGoogle" }]);
}

function signOut() {
  executeQueries([{ queryType: "signOut" }]);
}
</script>

<style>
body { font-family: sans-serif; max-width: 600px; margin: 2rem auto; padding: 0 1rem; }
.auth { margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; }
.form { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.form input { flex: 1; padding: 0.4rem 0.6rem; border: 1px solid #ccc; border-radius: 4px; }
ul { list-style: none; padding: 0; }
li { display: flex; justify-content: space-between; padding: 0.5rem; border-bottom: 1px solid #eee; }
button { cursor: pointer; padding: 0.3rem 0.8rem; }
.error { color: red; font-size: 0.9rem; }
</style>
