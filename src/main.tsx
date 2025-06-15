
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/scrollbar.css' // Import custom scrollbar styling
import Modal from 'react-modal'

Modal.setAppElement('#root');

// PWA Service Worker Registration with enhanced functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('OneAI Notes SW registered: ', registration);
        
        // Expose sync functionality globally
        (window as any).addToSyncQueue = (type: string, data: any) => {
          if (registration.active) {
            registration.active.postMessage({
              type: 'ADD_TO_SYNC_QUEUE',
              syncType: type,
              data: data
            });
          }
        };
        
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
