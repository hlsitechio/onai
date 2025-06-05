import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveNote } from '../utils/notesStorage';

const CreateSampleNote = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const createSampleNote = () => {
      try {
        // Create a new note with local state
        const newNote = {
          title: 'Windsurf Ai Note',
          content: 'This is a Windsurf Ai Note!',
          is_pinned: false,
          tags: ['windsurf', 'ai'],
          word_count: 5
        };

        // Save the note using our storage utility
        saveNote(newNote);
        setStatus('success');
        
        // Redirect to the notes list after a short delay
        setTimeout(() => {
          navigate('/app/notes');
        }, 1500);
      } catch (error) {
        console.error('Error in createSampleNote:', error);
        setError(error.message || 'An error occurred while creating the note');
        setStatus('error');
      }
    };

    createSampleNote();
  }, [navigate]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Creating your Windsurf Ai Note...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="text-center">
          <div className="bg-red-500/20 text-red-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-300 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="text-center">
        <div className="bg-green-500/20 text-green-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-gray-300 text-lg">Note created successfully! Redirecting...</p>
      </div>
    </div>
  );
};

export default CreateSampleNote;
