import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';
import { Toaster as ShadcnToaster } from '@/components/ui/toaster';
import { useTheme } from 'next-themes';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <>
      {children}
      {/* Use Sonner as primary toast system */}
      <SonnerToaster 
        theme={theme as any}
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          },
        }}
      />
      {/* Keep Shadcn toaster for compatibility */}
      <ShadcnToaster />
    </>
  );
};

export default ToastProvider;
