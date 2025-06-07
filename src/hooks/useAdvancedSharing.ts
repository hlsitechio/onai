
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import {
  createShareUrl,
  downloadAsFile,
  shareNatively,
  loadSharedNoteFromUrl,
  ShareOptions,
  ShareResult,
  SharedNote
} from '@/utils/advancedSharing';

export function useAdvancedSharing() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Check for shared note in URL on mount
  useEffect(() => {
    const sharedNote = loadSharedNoteFromUrl();
    if (sharedNote) {
      // This would typically be handled by the parent component
      // to load the shared note content
      console.log('Shared note loaded:', sharedNote);
    }
  }, []);

  const handleQuickShare = useCallback(async (
    content: string,
    method: 'url' | 'download' | 'native',
    options: ShareOptions = {}
  ): Promise<ShareResult> => {
    if (!content.trim()) {
      toast({
        title: "Nothing to share",
        description: "Please add some content to your note before sharing.",
        variant: "destructive"
      });
      return { success: false, error: "No content to share" };
    }

    setIsSharing(true);
    
    try {
      let result: ShareResult;

      switch (method) {
        case 'url':
          result = createShareUrl(content, options);
          if (result.success && result.shareUrl) {
            setShareUrl(result.shareUrl);
          }
          break;
        
        case 'download':
          result = downloadAsFile(content, options);
          break;
        
        case 'native':
          result = await shareNatively(content, options);
          break;
        
        default:
          result = { success: false, error: "Unknown sharing method" };
      }

      if (result.success) {
        toast({
          title: "Shared successfully",
          description: getSuccessMessage(method, result),
        });
      } else {
        toast({
          title: "Share failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Share failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsSharing(false);
    }
  }, []);

  const openAdvancedShare = useCallback(() => {
    setIsShareDialogOpen(true);
  }, []);

  const closeAdvancedShare = useCallback(() => {
    setIsShareDialogOpen(false);
  }, []);

  const clearShareUrl = useCallback(() => {
    setShareUrl(null);
  }, []);

  const getSuccessMessage = (method: string, result: ShareResult): string => {
    switch (method) {
      case 'url':
        return "Share link created and copied to clipboard";
      case 'download':
        return "File downloaded to your device";
      case 'native':
        return "Shared using your device's share menu";
      default:
        return "Content shared successfully";
    }
  };

  const checkNativeShareSupport = useCallback((): boolean => {
    return 'share' in navigator;
  }, []);

  const getSharingCapabilities = useCallback(() => {
    return {
      canShare: true, // Always true since we have fallbacks
      hasNativeShare: checkNativeShareSupport(),
      supportedFormats: ['txt', 'md', 'html', 'json'],
      hasUrlSharing: true,
      hasDownload: true
    };
  }, [checkNativeShareSupport]);

  return {
    // State
    isShareDialogOpen,
    shareUrl,
    isSharing,
    
    // Actions
    handleQuickShare,
    openAdvancedShare,
    closeAdvancedShare,
    clearShareUrl,
    
    // Utilities
    checkNativeShareSupport,
    getSharingCapabilities,
    
    // For external use
    loadSharedNoteFromUrl
  };
}
