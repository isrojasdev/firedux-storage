import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { FireduxStorage, initializeFiredux } from "firedux-storage";
import { firebaseConfig } from "./config/firebase";
import { todoSchema } from "./config/schemas";
import App from "./App";
import "./index.css";

initializeFiredux(firebaseConfig, { schemas: { todos: todoSchema } });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={FireduxStorage.store}>
      <App />
    </Provider>
  </StrictMode>
);
