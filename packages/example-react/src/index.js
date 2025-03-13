import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { Provider } from "react-redux";
import FireduxStorage, { initializeFiredux } from "firedux-storage";

// Firebase Initialization
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
