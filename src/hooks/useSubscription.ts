
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string;
  subscription_end: string | null;
  daily_usage: number;
  usage_limit: number;
  can_make_request: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get subscription info
      const { data: subscriberData, error: subscriberError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subscriberError && subscriberError.code !== 'PGRST116') {
        throw subscriberError;
      }

      // Get usage stats and permissions
      const { data: canMakeRequest, error: permissionError } = await supabase
        .rpc('can_make_ai_request', { user_uuid: user.id });

      if (permissionError) {
        console.warn('Error checking AI request permission:', permissionError);
      }

      // Fix: Explicitly call the function with parameters and ensure we get a number
      const { data: dailyUsageResult, error: usageError } = await supabase
        .rpc('get_daily_ai_usage', { 
          user_uuid: user.id,
          usage_date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
        });

      if (usageError) {
        console.warn('Error getting daily usage:', usageError);
      }

      // Ensure we have a number for daily usage
      const dailyUsage = typeof dailyUsageResult === 'number' ? dailyUsageResult : 0;

      const tier = subscriberData?.subscription_tier || 'starter';
      const usageLimit = tier === 'professional' ? 500 : 10;

      setSubscription({
        subscribed: subscriberData?.subscribed || false,
        subscription_tier: tier,
        subscription_end: subscriberData?.subscription_end || null,
        daily_usage: dailyUsage,
        usage_limit: usageLimit,
        can_make_request: canMakeRequest !== false,
      });
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const trackAIUsage = async (requestType: string, tokensUsed: number = 0) => {
    if (!user || !subscription) return;

    try {
      await supabase
        .from('ai_usage_tracking')
        .insert({
          user_id: user.id,
          request_type: requestType,
          tokens_used: tokensUsed,
          subscription_tier: subscription.subscription_tier,
        });

      // Refresh subscription data to update usage count
      await fetchSubscriptionData();
    } catch (error) {
      console.error('Error tracking AI usage:', error);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user]);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscriptionData,
    trackAIUsage,
  };
};
