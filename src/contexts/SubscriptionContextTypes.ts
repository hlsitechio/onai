import { createContext } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

// Extract the return type from the hook
export type UseSubscriptionReturn = ReturnType<typeof useSubscription>;

// Create context with default values
export const SubscriptionContext = createContext<UseSubscriptionReturn | undefined>(undefined);
