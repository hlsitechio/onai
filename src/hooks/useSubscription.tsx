import { useState, useEffect, useCallback } from 'react';
import { 
  getCurrentSubscription, 
  upgradeSubscription, 
  trackFeatureUsage, 
  canUseFeature, 
  getFeatureUsage,
  initSubscriptionStores,
  SubscriptionPlan,
  SubscriptionData
} from '@/utils/subscription/usageTracking';
import { toast } from 'sonner';

export type FeatureType = 'ai-gemini' | 'ai-image-generation';

interface FeatureUsage {
  used: number;
  total: number;
  remaining: number;
  percentUsed: number;
}

interface UseSubscriptionReturn {
  // Subscription data
  subscription: SubscriptionData | null;
  isLoading: boolean;
  error: string | null;
  
  // Feature usage
  featureUsage: Record<FeatureType, FeatureUsage>;
  
  // Actions
  checkFeatureAvailability: (feature: FeatureType) => Promise<boolean>;
  trackFeatureUse: (feature: FeatureType) => Promise<boolean>;
  upgradeWithCode: (code: string) => Promise<boolean>;
  refreshUsage: () => Promise<void>;
  
  // Helpers
  getPlanDisplayName: (plan: SubscriptionPlan) => string;
  getRemainingTime: () => string | null;
}

/**
 * Hook for managing subscription and feature usage
 */
export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [featureUsage, setFeatureUsage] = useState<Record<FeatureType, FeatureUsage>>({
    'ai-gemini': { used: 0, total: 10, remaining: 10, percentUsed: 0 },
    'ai-image-generation': { used: 0, total: 5, remaining: 5, percentUsed: 0 }
  });

  // Initialize subscription system
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        await initSubscriptionStores();
        await refreshData();
      } catch (err) {
        console.error('Failed to initialize subscription system:', err);
        setError('Failed to initialize subscription system. Some features may be limited.');
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Refresh all subscription data
  const refreshData = async () => {
    try {
      const currentSubscription = await getCurrentSubscription();
      setSubscription(currentSubscription);
      
      // Refresh usage for all features
      const usage: Record<FeatureType, FeatureUsage> = {
        'ai-gemini': await getFeatureUsageData('ai-gemini'),
        'ai-image-generation': await getFeatureUsageData('ai-image-generation')
      };
      
      setFeatureUsage(usage);
    } catch (err) {
      console.error('Error refreshing subscription data:', err);
      setError('Failed to load subscription data');
    }
  };

  // Get detailed usage stats for a feature
  const getFeatureUsageData = async (feature: FeatureType): Promise<FeatureUsage> => {
    const { used, total } = await getFeatureUsage(feature);
    const remaining = Math.max(0, total - used);
    const percentUsed = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
    
    return {
      used,
      total,
      remaining,
      percentUsed
    };
  };

  // Check if a feature is available to use
  const checkFeatureAvailability = async (feature: FeatureType): Promise<boolean> => {
    try {
      return await canUseFeature(feature);
    } catch (err) {
      console.error(`Error checking availability for ${feature}:`, err);
      return false;
    }
  };

  // Track feature usage and return if it was successful
  const trackFeatureUse = async (feature: FeatureType): Promise<boolean> => {
    try {
      const isAvailable = await checkFeatureAvailability(feature);
      
      if (!isAvailable) {
        toast.error(`Daily limit reached for this feature. Upgrade to continue using.`);
        return false;
      }
      
      await trackFeatureUsage(feature);
      
      // Refresh usage data after tracking
      const newUsage = await getFeatureUsageData(feature);
      setFeatureUsage(prev => ({
        ...prev,
        [feature]: newUsage
      }));
      
      return true;
    } catch (err) {
      console.error(`Error tracking usage for ${feature}:`, err);
      return false;
    }
  };

  // Upgrade subscription with a code
  const upgradeWithCode = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const updatedSubscription = await upgradeSubscription(code);
      setSubscription(updatedSubscription);
      
      // Refresh usage data after upgrade
      await refreshData();
      
      toast.success(`Successfully upgraded to ${getPlanDisplayName(updatedSubscription.plan)} plan!`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upgrade subscription';
      toast.error(errorMessage);
      console.error('Error upgrading subscription:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh usage data
  const refreshUsage = async (): Promise<void> => {
    await refreshData();
  };

  // Get a user-friendly name for the subscription plan
  const getPlanDisplayName = (plan: SubscriptionPlan): string => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return 'Free';
      case SubscriptionPlan.PRO:
        return 'Pro';
      case SubscriptionPlan.ENTERPRISE:
        return 'Enterprise';
      default:
        return 'Unknown';
    }
  };

  // Get a human-readable time remaining for the subscription
  const getRemainingTime = (): string | null => {
    if (!subscription || !subscription.expiresAt) return null;
    
    const expiryDate = new Date(subscription.expiresAt);
    const now = new Date();
    
    if (expiryDate <= now) return 'Expired';
    
    const diffInDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays > 30) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} remaining`;
    }
    
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} remaining`;
  };

  return {
    subscription,
    isLoading,
    error,
    featureUsage,
    checkFeatureAvailability,
    trackFeatureUse,
    upgradeWithCode,
    refreshUsage,
    getPlanDisplayName,
    getRemainingTime
  };
}
