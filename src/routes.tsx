import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import SecureNoteViewer from './components/sharing/SecureNoteViewer';

/**
 * Application router configuration
 * - Main application route: /
 * - Secure note viewer: /secure-view
 * - Note ID route: /:noteId to handle specific note viewing
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/secure-view',
    element: <SecureNoteViewer />,
  },
  {
    // Route to handle importing notes via URL parameters
    path: '/:tempKey',
    element: <App />,
  }
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
