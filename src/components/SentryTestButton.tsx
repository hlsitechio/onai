
import React from 'react';
import { Button } from '@/components/ui/button';

const SentryTestButton: React.FC = () => {
  const handleTestError = () => {
    throw new Error("This is your first error!");
  };

  return (
    <Button 
      onClick={handleTestError}
      variant="destructive"
      className="bg-red-500 hover:bg-red-600"
    >
      Break the world
    </Button>
  );
};

export default SentryTestButton;
