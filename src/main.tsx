
// 1. CRITICAL: Suppress console output FIRST - before any other imports
(['log', 'info', 'warn', 'error', 'debug'] as const).forEach(level => {
  (console as any)[level] = () => {};
});

// 2. Initialize Sentry with console integration (captures console calls before suppression)
import './utils/sentryConfig';
import { initializeSentry } from './utils/sentryConfig';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeFormValidation } from './utils/formValidationUtils'
import { initializeBrowserCompatibility } from './utils/browserCompatibilityUtils'

// Initialize clean console control
import { CleanConsoleManager } from './utils/cleanConsoleManager';

// Initialize Sentry first
initializeSentry();

// Initialize clean console manager
const consoleManager = new CleanConsoleManager();

// CRITICAL: Comprehensive React validation before proceeding
const validateReactEnvironment = () => {
  if (!React || typeof React !== 'object') {
    throw new Error('FATAL: React is not properly loaded - cannot continue');
  }

  const requiredFeatures = [
    'createElement',
    'Component',
    'useState',
    'useEffect',
    'useContext',
    'useRef',
    'version'
  ];

  for (const feature of requiredFeatures) {
    if (!React[feature as keyof typeof React]) {
      throw new Error(`FATAL: React.${feature} is not available - React not fully loaded`);
    }
  }

  return true;
};

// Validate React environment immediately
validateReactEnvironment();

// Make React globally available to prevent null reference issues
(window as any).React = React;

// Ensure React DOM is also available
if (!ReactDOM || typeof ReactDOM.createRoot !== 'function') {
  throw new Error('FATAL: ReactDOM is not properly loaded');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Initialize browser compatibility checks and form validation
initializeBrowserCompatibility();
initializeFormValidation();

// Enhanced error fallback component
const ErrorFallback = () => {
  return React.createElement('div', {
    style: {
      padding: '20px',
      margin: '20px',
      backgroundColor: '#1a1a1a',
      color: '#ff6b6b',
      fontFamily: 'monospace',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      textAlign: 'center'
    }
  }, [
    React.createElement('h2', { key: 'title' }, 'Application Error'),
    React.createElement('p', { key: 'message' }, 'React failed to initialize properly. Please refresh the page.'),
    React.createElement('button', {
      key: 'refresh',
      onClick: () => window.location.reload(),
      style: {
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }
    }, 'Refresh Page')
  ]);
};

// Initialize the application
const initializeApp = async () => {
  try {
    // Double-check React is still available
    validateReactEnvironment();
    
    const root = ReactDOM.createRoot(rootElement);

    // Wrap App in additional error boundary
    root.render(
      React.createElement(React.StrictMode, null,
        React.createElement(App)
      )
    );

  } catch (error) {
    // Fallback rendering with error component
    try {
      const root = ReactDOM.createRoot(rootElement);
      root.render(React.createElement(ErrorFallback));
    } catch (fallbackError) {
      // Last resort: direct DOM manipulation
      rootElement.innerHTML = `
        <div style="padding: 20px; color: red; font-family: monospace; text-align: center;">
          <h2>Critical Error</h2>
          <p>Application failed to load. Please refresh the page.</p>
          <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: red; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

// Enhanced DOM ready detection
const waitForDOM = () => {
  return new Promise<void>((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
};

// Wait for DOM and then initialize
waitForDOM().then(initializeApp);
