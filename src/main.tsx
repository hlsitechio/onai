
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeFormValidation } from './utils/formValidationUtils'
import { initializeBrowserCompatibility } from './utils/browserCompatibilityUtils'
import './utils/enhancedConsoleControl'

// Critical: Ensure React is properly loaded and available globally before anything else
if (!React || typeof React !== 'object') {
  throw new Error('React is not properly loaded - cannot continue');
}

// Verify React hooks are available
if (!React.useState || typeof React.useState !== 'function') {
  throw new Error('React.useState is not available - React hooks not loaded properly');
}

if (!React.useRef || typeof React.useRef !== 'function') {
  throw new Error('React.useRef is not available - React hooks not loaded properly');
}

if (!React.useContext || typeof React.useContext !== 'function') {
  throw new Error('React.useContext is not available - React hooks not loaded properly');
}

// Make React globally available to prevent null reference issues
(window as any).React = React;

// Ensure React DOM is also available
if (!ReactDOM || typeof ReactDOM.createRoot !== 'function') {
  throw new Error('ReactDOM is not properly loaded');
}

console.log('React initialization complete - Version:', React.version);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Initialize browser compatibility checks and form validation
initializeBrowserCompatibility();
initializeFormValidation();

// Initialize Sentry only after React is confirmed working
const initializeApp = async () => {
  try {
    console.log('Starting OneAI Notes application...');
    
    // Initialize Sentry with proper error handling
    try {
      const { initializeSentry } = await import('./utils/sentryConfig');
      initializeSentry();
    } catch (sentryError) {
      console.warn('Sentry initialization failed, continuing without it:', sentryError);
    }
    
    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    console.log('App rendered successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback rendering without Sentry if there's an error
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (fallbackError) {
      console.error('Fallback rendering also failed:', fallbackError);
      // Show a basic error message
      rootElement.innerHTML = '<div style="padding: 20px; color: red; font-family: monospace;">Application failed to load. Please refresh the page.</div>';
    }
  }
};

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
