
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const PricingSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started with AI-powered note taking',
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        '10 AI requests per day',
        'Basic note editor',
        'Cloud sync',
        'Web access',
        'Community support'
      ],
      limitedFeatures: [
        'Advanced AI features',
        'Priority support',
        'Custom integrations'
      ],
      buttonText: 'Get Started Free',
      buttonVariant: 'outline' as const,
      popular: false,
      priceId: ''
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '$9.99',
      period: '/month',
      description: 'Unlimited AI power for professionals and power users',
      icon: <Zap className="h-6 w-6" />,
      features: [
        '500 AI requests per day',
        'Advanced note editor',
        'Cloud sync',
        'Web access',
        'Advanced AI features',
        'Priority support',
        'Custom templates',
        'Export options',
        'Offline note'
      ],
      limitedFeatures: [],
      buttonText: 'Start Free Trial',
      buttonVariant: 'default' as const,
      popular: true,
      priceId: 'price_1QUzaDF4QdBZ7yYeVqB9KRxA' // Replace with your actual Stripe price ID
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For teams and organizations with advanced needs',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'Unlimited AI requests',
        'Team collaboration',
        'Advanced security',
        'Custom integrations',
        'Dedicated support',
        'On-premise deployment',
        'Custom branding',
        'SLA guarantee'
      ],
      limitedFeatures: [],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false,
      priceId: ''
    }
  ];

  const handlePlanSelection = async (plan: typeof plans[0]) => {
    if (plan.id === 'free') {
      if (!user) {
        navigate('/auth');
        return;
      }
      navigate('/app');
      return;
    }

    if (plan.id === 'enterprise') {
      // Handle enterprise contact
      toast({
        title: 'Contact Sales',
        description: 'Please contact our sales team for enterprise pricing.',
      });
      return;
    }

    if (!user) {
      navigate('/auth');
      return;
    }

    if (!plan.priceId) return;

    setLoading(plan.id);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: plan.priceId,
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

  return (
    <section id="pricing" className="py-16 px-4 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-noteflow-200 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Start for free and upgrade as you grow. All plans include our core AI-powered note-taking features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative bg-black/40 border-white/20 hover:border-white/30 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-noteflow-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-noteflow-500 hover:bg-noteflow-600">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-noteflow-500/20 rounded-lg text-noteflow-400">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <CardDescription className="text-gray-400 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limitedFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-500 line-through">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handlePlanSelection(plan)}
                  disabled={loading === plan.id}
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-noteflow-500 hover:bg-noteflow-600 text-white'
                      : plan.buttonVariant === 'outline'
                      ? 'border-white/20 text-white hover:bg-white/10'
                      : ''
                  }`}
                >
                  {loading === plan.id ? 'Processing...' : plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Need help choosing? <a href="#" className="text-noteflow-400 hover:text-noteflow-300">Contact our team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
