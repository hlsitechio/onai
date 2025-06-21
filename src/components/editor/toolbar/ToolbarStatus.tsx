
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ToolbarStatusProps {
  lastSaved?: string;
  isMobile: boolean;
}

const ToolbarStatus: React.FC<ToolbarStatusProps> = ({ lastSaved, isMobile }) => {
  const formatLastSaved = (timestamp?: string) => {
    if (!timestamp) return 'Not saved';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just saved to Supabase';
      if (diffInMinutes < 60) return `Saved ${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `Saved ${Math.floor(diffInMinutes / 60)}h ago`;
      return `Saved ${date.toLocaleDateString()}`;
    } catch {
      return 'Save time unknown';
    }
  };

  if (!lastSaved) return null;

  if (isMobile) {
    return (
      <div className="flex items-center gap-1 text-xs text-purple-300">
        <CheckCircle className="h-3 w-3" />
        <span>Saved</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-white/70">
      <CheckCircle className="h-4 w-4 text-green-400" />
      <span>{formatLastSaved(lastSaved)}</span>
    </div>
  );
};

export default ToolbarStatus;
