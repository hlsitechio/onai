
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/scrollbar.css' // Import custom scrollbar styling
import Modal from 'react-modal'

// Wait for DOM to be ready before rendering
const initializeApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error('Root element not found. Retrying in 100ms...');
    setTimeout(initializeApp, 100);
    return;
  }

  // Set app element for react-modal accessibility
  try {
    Modal.setAppElement('#root');
  } catch (error) {
    console.warn('Could not set Modal app element:', error);
  }

  // Create and render the app
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
