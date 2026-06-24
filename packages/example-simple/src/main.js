import { FireduxStorage, initializeFiredux, executeQueries, z } from "firedux-storage";

// ── Config ───────────────────────────────────────────────────────────────────
// Replace with your own Firebase project config or use environment variables.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// ── Init ─────────────────────────────────────────────────────────────────────
initializeFiredux(firebaseConfig, {
  schemas: {
    todos: z.object({ title: z.string().min(1, "Title is required") }),
  },
});

const store = FireduxStorage.store;

// ── DOM refs ─────────────────────────────────────────────────────────────────
const statusEl = document.getElementById("status");
const listEl = document.getElementById("list");
const inputEl = document.getElementById("input-title");
const btnAdd = document.getElementById("btn-add");
const btnSignIn = document.getElementById("btn-signin");
const btnSignOut = document.getElementById("btn-signout");
const authLabel = document.getElementById("auth-label");

// ── Render ───────────────────────────────────────────────────────────────────
function render() {
  const state = store.getState();
  const docs = state.firestore.collection.todos?.docs || [];
  const user = state.auth.user;

  // Auth UI
  if (user) {
    authLabel.textContent = `Signed in as ${user.email}`;
    btnSignIn.hidden = true;
    btnSignOut.hidden = false;
  } else {
    authLabel.textContent = "Not signed in";
    btnSignIn.hidden = false;
    btnSignOut.hidden = true;
  }

  // List UI
  statusEl.textContent = `${docs.length} todo(s)`;
  listEl.innerHTML = docs
    .map(
      (todo) =>
        `<li>
          <span>${todo.title}</span>
          <button class="danger" data-id="${todo.id}">Delete</button>
        </li>`
    )
    .join("");

  listEl.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => deleteTodo(btn.dataset.id));
  });
}

// ── Actions ───────────────────────────────────────────────────────────────────
async function addTodo() {
  const title = inputEl.value.trim();
  if (!title) return;

  const [res] = await executeQueries([
    { queryType: "addDocument", collectionName: "todos", documentData: { title } },
  ]);

  if (res.status === "failed") {
    alert(`Error: ${res.error}`);
  } else {
    inputEl.value = "";
  }
}

async function deleteTodo(id) {
  await executeQueries([
    { queryType: "removeDocument", collectionName: "todos", documentId: id },
  ]);
}

// ── Auth ──────────────────────────────────────────────────────────────────────
btnSignIn.addEventListener("click", () =>
  executeQueries([{ queryType: "signInGoogle" }])
);
btnSignOut.addEventListener("click", () =>
  executeQueries([{ queryType: "signOut" }])
);

// ── Boot ──────────────────────────────────────────────────────────────────────
btnAdd.addEventListener("click", addTodo);
inputEl.addEventListener("keydown", (e) => e.key === "Enter" && addTodo());

// Subscribe to store so UI re-renders on any state change
store.subscribe(render);
render();

// Start real-time listener
executeQueries([{ queryType: "obtainRealTime", collectionName: "todos", storeAs: "todos" }]);
