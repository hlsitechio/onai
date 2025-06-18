
import React from 'react';
import { Button } from '@/components/ui/button';

const SentryTestButton: React.FC = () => {
  const handleTestError = () => {
    throw new Error("This is your first error!");
  };

  return (
    <Button onClick={handleTestError} variant="destructive">
      Test Sentry Error
    </Button>
  );
};

export default SentryTestButton;
