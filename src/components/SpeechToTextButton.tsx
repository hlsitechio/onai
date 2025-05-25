
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, AlertCircle, Shield, WifiOff } from 'lucide-react';
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

  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  const [hasConnectivity, setHasConnectivity] = useState<boolean>(navigator.onLine);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setHasConnectivity(true);
    const handleOffline = () => setHasConnectivity(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check permission status on mount
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions) {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          console.log('Initial permission state:', result.state);
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
          
          result.onchange = () => {
            console.log('Permission state changed to:', result.state);
            setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
          };
        }
      } catch (error) {
        console.log('Permission API not supported, will check on first use');
        setPermissionStatus('unknown');
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
      console.log('Stopping speech recognition from button click');
      stopListening();
      return;
    }

    // Check for internet connection
    if (!hasConnectivity) {
      console.log('No internet connection, cannot start speech recognition');
      return;
    }

    console.log('Starting speech recognition from button click...');
    console.log('Current permission status:', permissionStatus);

    // If permission is explicitly denied or we haven't requested it yet
    if (permissionStatus === 'denied' || permissionStatus === 'prompt' || !hasRequestedPermission) {
      console.log('Requesting permission before starting...');
      setHasRequestedPermission(true);
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        console.log('Permission not granted, aborting');
        return;
      }
      // Update permission status after successful request
      setPermissionStatus('granted');
    }
    
    resetTranscript();
    startListening();
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

  if (!hasConnectivity) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(
          "transition-all duration-200 rounded-md border border-white/5 text-gray-500",
          className
        )}
        title="Voice input requires internet connection"
      >
        <WifiOff className="h-4 w-4" />
      </Button>
    );
  }

  // Determine button appearance based on state
  const getButtonState = () => {
    if (isListening) {
      return {
        icon: <MicOff className="h-4 w-4 animate-pulse" />,
        className: "text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/30",
        title: "Stop recording"
      };
    }
    
    if (permissionStatus === 'denied') {
      return {
        icon: <Shield className="h-4 w-4" />,
        className: "text-yellow-400 hover:text-yellow-300 bg-yellow-900/20 hover:bg-yellow-900/30",
        title: "Microphone access denied - click to request permission"
      };
    }
    
    if (permissionStatus === 'prompt' || !hasRequestedPermission) {
      return {
        icon: <Shield className="h-4 w-4" />,
        className: "text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/30",
        title: "Click to allow microphone access and start voice input"
      };
    }
    
    return {
      icon: <Mic className="h-4 w-4" />,
      className: "text-gray-300 hover:text-white hover:bg-gray-800/80",
      title: "Start voice input"
    };
  };

  const buttonState = getButtonState();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(
        "transition-all duration-200 rounded-md border border-white/5",
        buttonState.className,
        className
      )}
      title={buttonState.title}
    >
      <div className="flex items-center justify-center">
        {buttonState.icon}
      </div>
    </Button>
  );
};

export default SpeechToTextButton;
