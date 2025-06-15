
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/scrollbar.css' // Import custom scrollbar styling
import Modal from 'react-modal'

Modal.setAppElement('#root');

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('OneAI Notes SW registered: ', registration);
        
        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      })
      .catch((registrationError) => {
        console.log('OneAI Notes SW registration failed: ', registrationError);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
