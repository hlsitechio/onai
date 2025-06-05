import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateNoteButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Hide button on certain routes
  useEffect(() => {
    const hiddenRoutes = ['/auth', '/create-sample-note'];
    const shouldHide = hiddenRoutes.some(route => location.pathname.startsWith(route));
    setIsVisible(!shouldHide);
  }, [location.pathname]);

  const handleCreateNote = () => {
    // Navigate to the create note page
    navigate('/create-sample-note');
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-16 bottom-1/2 transform translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg"
          >
            Create Windsurf AI Note
            <div className="absolute right-0 top-1/2 w-2 h-2 bg-gray-800 transform translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          </motion.div>
        )}
        <button
          onClick={handleCreateNote}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Create Windsurf AI Note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default CreateNoteButton;
