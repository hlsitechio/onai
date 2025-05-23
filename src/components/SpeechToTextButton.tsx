
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { cn } from '@/lib/utils';

interface SpeechToTextButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({
  onTranscript,
  className
}) => {
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    requestPermission
  } = useSpeechToText();

  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  // Check permission status on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(result.state as 'granted' | 'denied');
        
        result.onchange = () => {
          setPermissionStatus(result.state as 'granted' | 'denied');
        };
      } catch (error) {
        console.log('Permission API not supported, will check on first use');
      }
    };

    if (navigator.permissions) {
      checkPermission();
    }
  }, []);

  // Update parent component when transcript changes
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const handleToggle = async () => {
    if (isListening) {
      stopListening();
    } else {
      // Check permission before starting
      if (permissionStatus === 'denied') {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;
      }
      
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(
          "transition-all duration-200 rounded-md border border-white/5 text-gray-500",
          className
        )}
        title="Speech recognition not supported in this browser"
      >
        <AlertCircle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "transition-all duration-200 rounded-md border border-white/5",
        isListening 
          ? "text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30" 
          : permissionStatus === 'denied'
          ? "text-yellow-400 hover:text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/30"
          : "text-gray-300 hover:text-white hover:bg-gray-800/80",
        className
      )}
      title={
        isListening 
          ? "Stop recording" 
          : permissionStatus === 'denied'
          ? "Microphone access denied - click to request permission"
          : "Start voice input"
      }
    >
      {isListening ? (
        <div className="flex items-center justify-center">
          <MicOff className="h-4 w-4 animate-pulse" />
        </div>
      ) : permissionStatus === 'denied' ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SpeechToTextButton;
