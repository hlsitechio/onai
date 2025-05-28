import React, { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionContext } from './SubscriptionContextTypes';

// Note: For Fast Refresh to work, this file only exports a single component

interface SubscriptionProviderProps {
  children: ReactNode;
}

/**
 * Provider component that makes subscription data and functions available
 * throughout the application
 */
export function SubscriptionProvider({ children }: SubscriptionProviderProps) {
  const subscriptionData = useSubscription();
  
  return (
    <SubscriptionContext.Provider value={subscriptionData}>
      {children}
    </SubscriptionContext.Provider>
  );
}
