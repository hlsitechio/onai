
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/scrollbar.css' // Import custom scrollbar styling
import './utils/consoleFilter' // Import console filtering for cleaner dev experience
import Modal from 'react-modal'

Modal.setAppElement('#root');

createRoot(document.getElementById("root")!).render(<App />);
