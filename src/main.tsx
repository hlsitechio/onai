
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logger } from './utils/consoleControl'

logger.info('Starting OneAI Notes application...');
logger.debug('React version:', React.version);
logger.debug('React object:', React);
logger.debug('React.useState:', React.useState);
logger.debug('React.useContext:', React.useContext);

// Ensure React is properly loaded before proceeding
if (!React || typeof React.createElement !== 'function') {
  throw new Error('React is not properly loaded');
}

if (!React.useState || typeof React.useState !== 'function') {
  throw new Error('React.useState is not available');
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Make React globally available to ensure all components can access it
(window as any).React = React;

logger.debug('Creating React root...');
const root = ReactDOM.createRoot(rootElement);

logger.debug('Rendering App component...');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

logger.info('App rendered successfully');
