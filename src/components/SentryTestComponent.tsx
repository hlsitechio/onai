
import React from 'react';
import { Button } from '@/components/ui/button';
import { testSentryCapture } from '@/utils/sentryConfig';
import { cleanConsoleControls } from '@/utils/console/CleanConsoleManager';

const SentryTestComponent: React.FC = () => {
  const handleTestSentry = () => {
    testSentryCapture();
  };

  const handleTestError = () => {
    throw new Error("🚨 Test uncaught error - should appear in Sentry");
  };

  const handleShowStatus = () => {
    const status = cleanConsoleControls.getStatus();
    const suppressedCounts = cleanConsoleControls.getSuppressedCounts();
    
    // Temporarily restore console to show status
    cleanConsoleControls.restore();
    console.log('📊 Console Manager Status:', status);
    console.log('📈 Suppressed Log Counts:', suppressedCounts);
    
    // Re-suppress after showing status
    setTimeout(() => {
      window.location.reload(); // Restart suppression
    }, 3000);
  };

  // Hide the component completely - don't render anything
  return null;
};

export default SentryTestComponent;
