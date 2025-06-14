
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initializeSupabaseSchema } from '@/utils/supabaseStorage';
import { validateStorageIntegrity } from '@/utils/securityUtils';

export function useAppInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing OneAI Notes application...');
        
        // Validate local storage integrity
        const storageValid = validateStorageIntegrity();
        if (!storageValid) {
          console.warn('Storage integrity validation failed, continuing with defaults');
        }

        // Initialize Supabase schema
        const supabaseResult = await initializeSupabaseSchema();
        if (!supabaseResult.success) {
          console.warn('Supabase initialization failed:', supabaseResult.error);
          toast({
            title: 'Database Connection Issue',
            description: 'Using local storage as fallback. Some features may be limited.',
            variant: 'destructive',
          });
        } else {
          console.log('Supabase initialized successfully');
        }

        // Check for URL parameters (shared notes, etc.)
        const urlParams = new URLSearchParams(window.location.search);
        const sharedNoteId = urlParams.get('note');
        if (sharedNoteId) {
          // Handle shared note loading
          console.log('Shared note detected:', sharedNoteId);
          const sharedContent = localStorage.getItem(`share-${sharedNoteId}`);
          if (sharedContent) {
            localStorage.setItem('onlinenote-shared-content', sharedContent);
            toast({
              title: 'Shared note loaded',
              description: 'The shared note has been loaded into the editor.',
            });
          }
        }

        setIsInitialized(true);
        console.log('Application initialization completed');
      } catch (error) {
        console.error('Application initialization error:', error);
        setHasError(true);
        toast({
          title: 'Initialization Error',
          description: 'There was an error starting the application. Please refresh the page.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [toast]);

  return {
    isInitialized,
    isLoading,
    hasError,
  };
}
