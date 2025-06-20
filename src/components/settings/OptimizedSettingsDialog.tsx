
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Settings, Palette, Zap, Shield, Smartphone } from 'lucide-react';

// Lazy load heavy components to prevent render blocking
const UserProfile = lazy(() => import('@/components/UserProfile'));
const GeneralSettings = lazy(() => import('./GeneralSettings'));
const AppearanceSettings = lazy(() => import('./AppearanceSettings'));
const AISettings = lazy(() => import('./AISettings'));
const PrivacySettings = lazy(() => import('./PrivacySettings'));
const PWASettings = lazy(() => import('./PWASettings'));

interface OptimizedSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-full" />
  </div>
);

const OptimizedSettingsDialog: React.FC<OptimizedSettingsDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isVisible, setIsVisible] = useState(false);

  // Prevent render conflicts by managing visibility state
  useEffect(() => {
    if (open) {
      // Small delay to prevent flash
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [open]);

  if (!isVisible && !open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="general">
              <Settings className="h-4 w-4 mr-1" />
              General
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-1" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Zap className="h-4 w-4 mr-1" />
              AI
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="h-4 w-4 mr-1" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="pwa">
              <Smartphone className="h-4 w-4 mr-1" />
              PWA
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <UserProfile />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <GeneralSettings />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <AppearanceSettings />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <AISettings />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <PrivacySettings />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="pwa" className="space-y-6">
            <Suspense fallback={<LoadingSkeleton />}>
              <PWASettings />
            </Suspense>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default OptimizedSettingsDialog;
