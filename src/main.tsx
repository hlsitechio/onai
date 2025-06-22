
<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeSentry } from './utils/sentryConfig'
import { cleanConsoleControls } from './utils/console/CleanConsoleManager'

// Simple React validation without complex overrides
const validateReact = () => {
  if (!React || typeof React.createElement !== 'function') {
    throw new Error('React is not properly loaded');
  }
  if (!ReactDOM || typeof ReactDOM.createRoot !== 'function') {
    throw new Error('ReactDOM is not properly loaded');
  }
};

// Validate React environment
validateReact();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Initialize Sentry first (required for console capture)
initializeSentry();

// Simple initialization without complex console overrides
const initializeApp = () => {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(App)
      )
    );
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace; text-align: center;">
        <h2>Application Error</h2>
        <p>Failed to load. Please refresh the page.</p>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: red; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
};

// Wait for DOM and initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Make console controls available globally in development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).cleanConsoleControls = cleanConsoleControls;
}
=======
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
>>>>>>> noteai-suite/main
