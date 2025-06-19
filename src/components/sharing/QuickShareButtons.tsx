
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Share, 
  Download, 
  Link, 
  Smartphone,
  MoreHorizontal 
} from "lucide-react";
import { useAdvancedSharing } from '@/hooks/useAdvancedSharing';
import { ShareOptions } from '@/utils/advancedSharing';

interface QuickShareButtonsProps {
  content: string;
  title?: string;
  onAdvancedShare?: () => void;
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'default' | 'lg';
}

const QuickShareButtons: React.FC<QuickShareButtonsProps> = ({
  content,
  title,
  onAdvancedShare,
  variant = 'horizontal',
  size = 'default'
}) => {
  const { 
    handleQuickShare, 
    isSharing, 
    checkNativeShareSupport,
    openAdvancedShare 
  } = useAdvancedSharing();

  const shareOptions: ShareOptions = {
    title: title || 'My Note',
    format: 'txt',
    includeMetadata: true
  };

  const handleUrlShare = async () => {
    await handleQuickShare(content, 'url', shareOptions);
  };

  const handleDownload = async () => {
    await handleQuickShare(content, 'download', shareOptions);
  };

  const handleNativeShare = async () => {
    // Ensure this is called from a user interaction
    await handleQuickShare(content, 'native', shareOptions);
  };

  const handleAdvancedShare = () => {
    if (onAdvancedShare) {
      onAdvancedShare();
    } else {
      openAdvancedShare();
    }
  };

  const hasNativeShare = checkNativeShareSupport();

  const buttonClass = variant === 'vertical' 
    ? "w-full justify-start" 
    : "flex-1";

  const containerClass = variant === 'vertical'
    ? "flex flex-col gap-2"
    : "flex gap-2";

  return (
    <div className={containerClass}>
      <Button
        variant="outline"
        size={size}
        className={`${buttonClass} bg-black/30 border-white/10 hover:bg-black/40`}
        onClick={handleUrlShare}
        disabled={isSharing || !content.trim()}
      >
        <Link className="h-4 w-4 mr-2" />
        Share Link
      </Button>

      <Button
        variant="outline"
        size={size}
        className={`${buttonClass} bg-black/30 border-white/10 hover:bg-black/40`}
        onClick={handleDownload}
        disabled={isSharing || !content.trim()}
      >
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>

      {hasNativeShare && (
        <Button
          variant="outline"
          size={size}
          className={`${buttonClass} bg-black/30 border-white/10 hover:bg-black/40`}
          onClick={handleNativeShare}
          disabled={isSharing || !content.trim()}
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}

      <Button
        variant="outline"
        size={size}
        className={`${buttonClass} bg-black/30 border-white/10 hover:bg-black/40`}
        onClick={handleAdvancedShare}
        disabled={isSharing || !content.trim()}
      >
        <MoreHorizontal className="h-4 w-4 mr-2" />
        More
      </Button>
    </div>
  );
};

export default QuickShareButtons;
