
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

  // Check if device has an available microphone
  const checkMicrophoneAvailability = async (): Promise<boolean> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasMicrophone = devices.some(device => device.kind === 'audioinput');
      
      if (!hasMicrophone) {
        toast({
          title: "No microphone detected",
          description: "Please connect a microphone and try again.",
          variant: "destructive",
          duration: 5000,
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking microphone availability:', error);
      toast({
        title: "Microphone check failed",
        description: "Could not check for available audio devices.",
        variant: "destructive",
        duration: 5000,
      });
      return false;
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Requesting microphone permission...');
      
      // First check if we have a microphone
      const hasMicrophone = await checkMicrophoneAvailability();
      if (!hasMicrophone) {
        return false;
      }
      
      // Check if permissions API is available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        console.log('Current permission state:', permission.state);
        
        if (permission.state === 'denied') {
          toast({
            title: "Microphone access denied",
            description: "Please click the microphone icon in your browser's address bar and allow access, then try again.",
            variant: "destructive",
            duration: 5000,
          });
          return false;
        }
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      toast({
        title: "Microphone access granted",
        description: "You can now use voice input. Click the microphone button to start speaking.",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      
      let title = "Microphone access required";
      let description = "Please allow microphone access to use voice input.";
      
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            description = "Microphone access was denied. Please click the microphone icon in your browser's address bar and allow access, then try again.";
            break;
          case 'NotFoundError':
            title = "No microphone found";
            description = "Please connect a microphone and try again.";
            break;
          case 'NotReadableError':
            title = "Microphone in use";
            description = "Your microphone may be in use by another application. Please close other applications using your microphone and try again.";
            break;
          case 'NotSupportedError':
            title = "Microphone not supported";
            description = "Your browser or device doesn't support microphone access.";
            break;
          default:
            description = "Could not access microphone. Please check your browser settings and try again.";
        }
      }
      
      toast({
        title,
        description,
        variant: "destructive",
        duration: 5000,
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

    console.log('Starting speech recognition...');

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started successfully');
        setIsListening(true);
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

      recognition.onerror = async (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = "Speech recognition failed";
        let actionMessage = "Please try again.";
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = "Microphone access denied";
            actionMessage = "Please allow microphone access in your browser settings. Click the microphone icon in the address bar and select 'Allow', then try again.";
            
            // Try to request permission again
            setTimeout(async () => {
              const hasPermission = await requestPermission();
              if (hasPermission) {
                toast({
                  title: "Permission granted",
                  description: "You can now use voice input. Click the microphone button again to start.",
                  duration: 3000,
                });
              }
            }, 1000);
            break;
            
          case 'no-speech':
            errorMessage = "No speech detected";
            actionMessage = "Please speak clearly and try again.";
            break;
            
          case 'audio-capture':
            errorMessage = "No microphone found";
            actionMessage = "Please check that your microphone is connected and working.";
            break;
            
          case 'network':
            errorMessage = "Network error";
            actionMessage = "Please check your internet connection.";
            break;
            
          case 'aborted':
            errorMessage = "Speech recognition was stopped";
            actionMessage = "Click the microphone button to start again.";
            break;
            
          default:
            actionMessage = `Error: ${event.error}. Please try again.`;
        }

        toast({
          title: errorMessage,
          description: actionMessage,
          variant: "destructive",
          duration: 5000,
        });
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
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
    console.log('Stopping speech recognition...');
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
