import React, { ReactNode, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ZapIcon, AlertTriangle } from 'lucide-react';

interface GeminiUsageWrapperProps {
  children: ReactNode;
  featureId: 'ai-gemini' | 'ai-image-generation';
  onUseFeature: () => void;
  className?: string;
}

/**
 * Wrapper component that enforces usage limits for Gemini AI features
 * This component will track usage and show upgrade prompts when limits are reached
 */
export const GeminiUsageWrapper: React.FC<GeminiUsageWrapperProps> = ({
  children,
  featureId,
  onUseFeature,
  className
}) => {
  const { featureUsage, trackFeatureUse, subscription } = useSubscription();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  
  // Handle feature usage with limit enforcement
  const handleUseFeature = async () => {
    const canUse = await trackFeatureUse(featureId);
    
    if (canUse) {
      // Allow the feature to be used
      onUseFeature();
    } else {
      // Show limit reached dialog
      setShowLimitDialog(true);
    }
  };
  
  // Format the feature name for display
  const getFeatureName = () => {
    return featureId === 'ai-gemini' 
      ? 'AI Assistant' 
      : 'Image Generation';
  };
  
  return (
    <>
      {/* Wrap the children with our usage tracking */}
      <div className={`relative ${className || ''}`}>
        {/* Usage indicator - only show if close to limit */}
        {featureUsage[featureId].percentUsed > 70 && (
          <div className="absolute -top-1 -right-1 z-10">
            <div className="bg-white dark:bg-gray-800 rounded-full p-1 shadow-md flex items-center">
              <div className="w-4 h-4 mr-1 relative">
                <Progress 
                  value={featureUsage[featureId].percentUsed} 
                  className={`h-4 w-4 rounded-full ${featureUsage[featureId].percentUsed > 90 ? "[&>div]:bg-red-500" : "[&>div]:bg-amber-500"}`}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
                  {featureUsage[featureId].percentUsed}%
                </span>
              </div>
              <span className="text-[9px] font-medium pr-1">
                {featureUsage[featureId].remaining} left
              </span>
            </div>
          </div>
        )}
        
        {/* Clone the children with our handler */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...child.props,
              onClick: (e: React.MouseEvent) => {
                // Call the original onClick if it exists
                if (child.props.onClick) {
                  child.props.onClick(e);
                }
                handleUseFeature();
              }
            });
          }
          return child;
        })}
      </div>
      
      {/* Limit reached dialog */}
      <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Daily Limit Reached</span>
            </DialogTitle>
            <DialogDescription>
              You've reached your daily limit for {getFeatureName().toLowerCase()} requests.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{getFeatureName()} Usage</span>
                <span className="text-xs font-medium">
                  {featureUsage[featureId].used}/{featureUsage[featureId].total}
                </span>
              </div>
              <Progress value={100} className="h-2 [&>div]:bg-red-500" />
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-sm">
              <p className="text-amber-800 dark:text-amber-200 font-medium mb-1">
                Upgrade to continue using {getFeatureName()}
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-xs">
                The {subscription?.plan.toLowerCase()} plan allows {featureUsage[featureId].total} {getFeatureName().toLowerCase()} requests per day.
                Upgrade to increase your daily limit.
              </p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowLimitDialog(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => {
                setShowLimitDialog(false);
                // This would open the subscription manager
                document.getElementById('subscription-manager-trigger')?.click();
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              View Upgrade Options
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
