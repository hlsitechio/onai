
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Starting OneAI Notes application...');
console.log('React version:', React.version);

// Ensure React is properly loaded before proceeding
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React is not properly loaded');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
