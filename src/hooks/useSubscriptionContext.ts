import { useContext } from 'react';
import { SubscriptionContext } from '@/contexts/SubscriptionContext';

/**
 * Hook to use the subscription context
 * Must be used within a SubscriptionProvider component
 */
export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error('useSubscriptionContext must be used within a SubscriptionProvider');
  }
  
  return context;
}

// Re-export types for convenience
export type { FeatureType } from '@/hooks/useSubscription';
