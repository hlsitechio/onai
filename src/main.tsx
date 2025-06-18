
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is properly loaded before proceeding
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React is not properly loaded');
}

if (!React.useState || typeof React.useState !== 'function') {
  throw new Error('React.useState is not available');
}

if (!React.useRef || typeof React.useRef !== 'function') {
  throw new Error('React.useRef is not available');
}

if (!React.useContext || typeof React.useContext !== 'function') {
  throw new Error('React.useContext is not available');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Make React globally available to ensure all components can access it
(window as any).React = React;

console.log('React version:', React.version);
console.log('Starting OneAI Notes application...');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('App rendered successfully');
