
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateNoteButton from './components/CreateNoteButton';
import CreateSampleNote from './components/CreateSampleNote';
import './index.css';

// Simple home page component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">ONAI Notes</h1>
        <p className="text-center text-gray-300 mb-8">
          AI-powered note-taking application
        </p>
        
        <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-300 mb-4">
            Welcome to ONAI Notes! Click the + button in the bottom right to create your first note.
          </p>
        </div>
      </div>
      <CreateNoteButton />
    </div>
  );
};

// Simple notes page component
const NotesPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Notes</h1>
        <p className="text-gray-300">Your notes will appear here.</p>
      </div>
      <CreateNoteButton />
    </div>
  );
};

function App() {
  return (
    <Router basename={import.meta.env.PROD ? '/notes-app' : '/'}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/app/notes" element={<NotesPage />} />
        <Route path="/create-sample-note" element={<CreateSampleNote />} />
      </Routes>
    </Router>
  );
}

export default App;
