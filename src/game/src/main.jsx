import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
import AppRoutes from "./react-router/AppRoutes";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
