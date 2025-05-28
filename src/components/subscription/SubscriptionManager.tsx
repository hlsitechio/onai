import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSubscription, FeatureType } from '@/hooks/useSubscription';
import { SubscriptionPlan } from '@/utils/subscription/usageTracking';
import { Sparkles, ZapIcon, BotIcon, ImageIcon, Lock, Star, CheckIcon, XIcon } from 'lucide-react';

interface FeatureProps {
  name: string;
  icon: React.ReactNode;
  description: string;
  featureId: FeatureType;
}

const AI_FEATURES: FeatureProps[] = [
  {
    name: 'AI Assistant',
    icon: <BotIcon className="h-4 w-4 text-blue-400" />,
    description: 'Smart analysis and content generation',
    featureId: 'ai-gemini'
  },
  {
    name: 'Image Generation',
    icon: <ImageIcon className="h-4 w-4 text-purple-400" />,
    description: 'Create images with AI',
    featureId: 'ai-image-generation'
  }
];

const PLAN_FEATURES = {
  [SubscriptionPlan.FREE]: {
    price: 'Free',
    features: [
      'Up to 10 AI requests per day',
      'Up to 5 image generations per day',
      'Basic analysis features',
      'Standard response time'
    ]
  },
  [SubscriptionPlan.PRO]: {
    price: '$4.99/month',
    features: [
      'Up to 50 AI requests per day',
      'Up to 25 image generations per day',
      'Advanced analysis features',
      'Priority response time',
      '30-day access'
    ]
  },
  [SubscriptionPlan.ENTERPRISE]: {
    price: '$9.99/month',
    features: [
      '200 AI requests per day',
      '100 image generations per day',
      'All premium features',
      'Fastest response time',
      'Unlimited access'
    ]
  }
};

export const SubscriptionManager: React.FC = () => {
  const {
    subscription,
    isLoading,
    featureUsage,
    upgradeWithCode,
    getPlanDisplayName,
    getRemainingTime
  } = useSubscription();
  
  const [upgradeCode, setUpgradeCode] = useState('');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [activeTab, setActiveTab] = useState<'usage' | 'plans'>('usage');
  
  const handleUpgrade = async () => {
    if (!upgradeCode) return;
    
    setIsUpgrading(true);
    try {
      await upgradeWithCode(upgradeCode);
      setUpgradeCode('');
    } finally {
      setIsUpgrading(false);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative group bg-background hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center"
        >
          <div className="flex items-center space-x-1">
            <ZapIcon className="h-4 w-4 text-yellow-500" />
            <span className="text-xs font-medium">
              {isLoading ? 'Loading...' : subscription ? getPlanDisplayName(subscription.plan) : 'Free'}
            </span>
          </div>
          {subscription?.plan === SubscriptionPlan.FREE && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-gray-900">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>OneAI Subscription</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Content */}
        <div className="p-6 pt-2">
          {isLoading ? (
            <div className="py-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Current plan banner */}
              <div className={`rounded-lg p-3 mb-4 flex justify-between items-center ${
                subscription?.plan === SubscriptionPlan.FREE
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : subscription?.plan === SubscriptionPlan.PRO
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                  : 'bg-gradient-to-r from-purple-500/20 to-yellow-500/20'
              }`}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Badge className={`${
                      subscription?.plan === SubscriptionPlan.FREE
                        ? 'bg-gray-500'
                        : subscription?.plan === SubscriptionPlan.PRO
                        ? 'bg-blue-500'
                        : 'bg-purple-500'
                    }`}>
                      {getPlanDisplayName(subscription?.plan || SubscriptionPlan.FREE)}
                    </Badge>
                    {getRemainingTime() && (
                      <span className="text-xs text-gray-500">{getRemainingTime()}</span>
                    )}
                  </div>
                  <p className="text-sm mt-1">
                    {subscription?.plan === SubscriptionPlan.FREE
                      ? 'Free tier with limited features'
                      : subscription?.plan === SubscriptionPlan.PRO
                      ? 'Pro tier with extended features'
                      : 'Enterprise tier with all features'
                    }
                  </p>
                </div>
                
                {subscription?.plan === SubscriptionPlan.FREE && (
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    onClick={() => setActiveTab('plans')}
                  >
                    Upgrade
                  </Button>
                )}
              </div>
              
              {/* Tabs */}
              <div className="flex border-b mb-4">
                <button
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'usage'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('usage')}
                >
                  Usage
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'plans'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('plans')}
                >
                  Plans
                </button>
              </div>
              
              {/* Usage Tab */}
              {activeTab === 'usage' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-medium mb-3">Today's Usage</h3>
                  
                  {AI_FEATURES.map((feature) => (
                    <div key={feature.featureId} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          {feature.icon}
                          <span className="text-sm font-medium">{feature.name}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">{featureUsage[feature.featureId].used}</span>
                          <span className="text-gray-500">/{featureUsage[feature.featureId].total}</span>
                        </div>
                      </div>
                      <Progress 
                        value={featureUsage[feature.featureId].percentUsed} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {featureUsage[feature.featureId].remaining} requests remaining today
                      </p>
                    </div>
                  ))}
                  
                  {subscription?.plan === SubscriptionPlan.FREE && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-3 text-sm">
                      <p className="font-medium mb-1">Need more requests?</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Upgrade to Pro or Enterprise to get more daily requests and unlock additional features.
                      </p>
                      <Button 
                        size="sm" 
                        className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                        onClick={() => setActiveTab('plans')}
                      >
                        View Plans
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Plans Tab */}
              {activeTab === 'plans' && (
                <div>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    {Object.values(SubscriptionPlan).map((plan) => (
                      <div 
                        key={plan}
                        className={`border rounded-lg p-4 ${
                          subscription?.plan === plan
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold">{getPlanDisplayName(plan)}</h3>
                          {subscription?.plan === plan && (
                            <Badge className="bg-blue-500">Current</Badge>
                          )}
                        </div>
                        <p className="text-lg font-bold mb-2">{PLAN_FEATURES[plan].price}</p>
                        <ul className="text-sm space-y-2 mb-4">
                          {PLAN_FEATURES[plan].features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {/* Upgrade form */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Enter Upgrade Code</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Enter your upgrade code to activate Pro or Enterprise features.
                      <br />
                      <span className="text-blue-500">Need a code? Try: PRO-ONEAI-2025 or ENTERPRISE-ONEAI-2025</span>
                    </p>
                    <div className="flex space-x-2">
                      <Input
                        value={upgradeCode}
                        onChange={(e) => setUpgradeCode(e.target.value)}
                        placeholder="Enter upgrade code"
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleUpgrade} 
                        disabled={isUpgrading || !upgradeCode}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {isUpgrading ? (
                          <div className="flex items-center gap-1">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Upgrading...</span>
                          </div>
                        ) : (
                          'Upgrade'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
