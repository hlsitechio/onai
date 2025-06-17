
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  priceId: string;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for getting started with AI-powered note taking',
    priceId: '',
    icon: <Sparkles className="h-6 w-6" />,
    features: [
      { text: '10 AI requests per day', included: true },
      { text: 'Basic note editor', included: true },
      { text: 'Cloud sync', included: true },
      { text: 'Web access', included: true },
      { text: 'Advanced AI features', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$9.99/month',
    description: 'Unlimited AI power for professionals and power users',
    priceId: 'price_1QUzaDF4QdBZ7yYeVqB9KRxA', // Replace with your actual Stripe price ID
    icon: <Zap className="h-6 w-6" />,
    popular: true,
    features: [
      { text: '500 AI requests per day', included: true },
      { text: 'Advanced note editor', included: true },
      { text: 'Cloud sync', included: true },
      { text: 'Web access', included: true },
      { text: 'Advanced AI features', included: true },
      { text: 'Priority support', included: true },
    ],
  },
];

const SubscriptionPlans: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscription, refetch } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, planName: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to subscribe to a plan.',
        variant: 'destructive',
      });
      return;
    }

    if (!priceId) {
      toast({
        title: 'Free plan',
        description: 'You are already on the free starter plan!',
      });
      return;
    }

    setLoading(priceId);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: window.location.href,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        // Refresh subscription status after a short delay
        setTimeout(() => {
          refetch();
        }, 2000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: 'Subscription failed',
        description: 'There was an error processing your subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const isCurrentPlan = (planId: string) => {
    if (!subscription) return planId === 'starter';
    return subscription.subscription_tier === planId;
  };

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upgrade to Professional for unlimited AI requests and advanced features
        </p>
        {subscription && (
          <div className="mt-4 text-sm text-gray-300">
            Current usage: {subscription.daily_usage}/{subscription.usage_limit} requests today
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.id);
          
          return (
            <Card
              key={plan.id}
              className={`relative bg-black/40 border-white/20 ${
                plan.popular ? 'ring-2 ring-noteflow-500' : ''
              } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && !isCurrent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-noteflow-500">
                  Most Popular
                </Badge>
              )}
              
              {isCurrent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                  Current Plan
                </Badge>
              )}

              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-noteflow-500/20 rounded-lg text-noteflow-400">
                    {plan.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-400">
                      {plan.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white">{plan.price}</div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check
                        className={`h-4 w-4 ${
                          feature.included ? 'text-green-500' : 'text-gray-500'
                        }`}
                      />
                      <span
                        className={
                          feature.included ? 'text-gray-300' : 'text-gray-500'
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.priceId, plan.name)}
                  disabled={loading === plan.priceId || isCurrent}
                  className={`w-full ${
                    plan.popular && !isCurrent
                      ? 'bg-noteflow-500 hover:bg-noteflow-600'
                      : isCurrent
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {loading === plan.priceId ? 'Processing...' : 
                   isCurrent ? 'Current Plan' :
                   plan.priceId ? 'Subscribe Now' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">
          Need to manage your subscription? Contact support or visit your account settings.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
