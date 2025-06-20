
import React from 'react';
import { ErrorMonitoringProvider } from '@/contexts/ErrorMonitoringContext';
import NotesDashboard from '@/components/notes/NotesDashboard';

const Notes: React.FC = () => {
  return (
    <ErrorMonitoringProvider>
      <NotesDashboard />
    </ErrorMonitoringProvider>
  );
};

export default Notes;
