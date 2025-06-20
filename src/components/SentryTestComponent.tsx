
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

  if (import.meta.env.PROD) {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-4 z-50">
      <h3 className="text-white text-sm font-semibold mb-2">Sentry Test Panel</h3>
      <div className="flex flex-col space-y-2">
        <Button onClick={handleTestSentry} size="sm" variant="outline">
          Test Sentry Capture
        </Button>
        <Button onClick={handleTestError} size="sm" variant="destructive">
          Test Error
        </Button>
        <Button onClick={handleShowStatus} size="sm" variant="secondary">
          Show Status
        </Button>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Check Sentry dashboard for captured logs
      </p>
    </div>
  );
};

export default SentryTestComponent;
