import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './input.css'; // <--- Thabbet el path s7i7
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);