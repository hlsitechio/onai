
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeFormValidation } from './utils/formValidationUtils'
import { initializeBrowserCompatibility } from './utils/browserCompatibilityUtils'
import './utils/enhancedConsoleControl' // Initialize enhanced console control

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

// Initialize browser compatibility checks and form validation
initializeBrowserCompatibility();
initializeFormValidation();

// Initialize Sentry only after React is ready and DOM is loaded
const initializeApp = async () => {
  try {
    // Only initialize Sentry after React is confirmed to be working
    const { initializeSentry } = await import('./utils/sentryConfig');
    initializeSentry();
    
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback rendering without Sentry
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
