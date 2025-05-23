
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseSpeechToTextReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  requestPermission: () => Promise<boolean>;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if browser supports speech recognition
  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Request microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast({
        title: "Microphone access required",
        description: "Please allow microphone access in your browser settings to use voice input.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }

    // Request permission first
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
        toast({
          title: "🎤 Listening...",
          description: "Speak now and your words will be transcribed.",
          duration: 2000,
        });
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Speech recognition failed. Please try again.";
        let actionMessage = "";
        
        if (event.error === 'not-allowed') {
          errorMessage = "Microphone access was denied.";
          actionMessage = "Please click the microphone icon in your browser's address bar and allow access, then try again.";
        } else if (event.error === 'no-speech') {
          errorMessage = "No speech detected.";
          actionMessage = "Please speak clearly and try again.";
        } else if (event.error === 'audio-capture') {
          errorMessage = "No microphone found.";
          actionMessage = "Please check that your microphone is connected and try again.";
        } else if (event.error === 'network') {
          errorMessage = "Network error occurred.";
          actionMessage = "Please check your internet connection and try again.";
        }

        toast({
          title: errorMessage,
          description: actionMessage,
          variant: "destructive",
          duration: 5000,
        });
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      toast({
        title: "Failed to start speech recognition",
        description: "Please check your microphone permissions and try again.",
        variant: "destructive"
      });
    }
  }, [isSupported, toast, requestPermission]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    requestPermission
  };
};
