
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
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
    resetTranscript
  } = useSpeechToText();

  // Update parent component when transcript changes
  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
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
          : "text-gray-300 hover:text-white hover:bg-gray-800/80",
        className
      )}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? (
        <div className="flex items-center justify-center">
          <MicOff className="h-4 w-4 animate-pulse" />
        </div>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default SpeechToTextButton;
