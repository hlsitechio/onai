
import { useRef, useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useCameraManager = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind, track.readyState);
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoReady(false);
  }, [stream]);

  const startCamera = useCallback(async () => {
    console.log('Starting camera...');
    setIsLoading(true);
    setCameraError(null);
    setIsVideoReady(false);
    
    try {
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Simplified camera constraints - less restrictive
      const constraints = {
        video: {
          facingMode: 'environment', // Try back camera first
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 480, max: 1080 }
        }
      };

      let mediaStream: MediaStream;
      
      try {
        console.log('Trying back camera...');
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (backCameraError) {
        console.log('Back camera failed, trying any camera:', backCameraError);
        // Fallback to any available camera with minimal constraints
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280, min: 320 },
            height: { ideal: 720, min: 240 }
          }
        });
      }
      
      console.log('Camera stream obtained:', mediaStream.getVideoTracks().length, 'video tracks');
      console.log('Video track settings:', mediaStream.getVideoTracks()[0]?.getSettings());
      
      // Set stream state
      setStream(mediaStream);
      
      // Assign to video element
      if (videoRef.current) {
        console.log('Assigning stream to video element');
        const video = videoRef.current;
        
        // Clear any existing source
        video.srcObject = null;
        video.load();
        
        // Set the new stream
        video.srcObject = mediaStream;
        
        // Set up event handlers
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded');
          console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
          console.log('Video ready state:', video.readyState);
          
          // Ensure video dimensions are valid
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            setIsVideoReady(true);
            console.log('Video is ready to display');
          } else {
            console.warn('Video dimensions are zero');
          }
        };
        
        const handleCanPlay = () => {
          console.log('Video can play');
          if (!isVideoReady && video.videoWidth > 0 && video.videoHeight > 0) {
            setIsVideoReady(true);
          }
        };
        
        const handleError = (e: Event) => {
          console.error('Video error event:', e);
          setCameraError('Video playback failed');
        };
        
        // Add event listeners
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('canplay', handleCanPlay);
        video.addEventListener('error', handleError);
        
        // Cleanup function
        const cleanup = () => {
          video.removeEventListener('loadedmetadata', handleLoadedMetadata);
          video.removeEventListener('canplay', handleCanPlay);
          video.removeEventListener('error', handleError);
        };
        
        try {
          // Start playing
          await video.play();
          console.log('Video started playing');
          
          // Set a timeout to ensure video is ready
          setTimeout(() => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
              setIsVideoReady(true);
              console.log('Video ready after timeout check');
            }
          }, 1000);
          
        } catch (playError) {
          console.error('Video play error:', playError);
          setCameraError('Failed to start video playback');
          cleanup();
          throw playError;
        }
        
        // Store cleanup for later use
        (video as any)._cleanup = cleanup;
      }
      
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError(error.message || 'Failed to access camera');
      toast({
        title: "Camera access failed",
        description: "Please grant camera permission and ensure your camera is not being used by another application.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !stream || !isVideoReady) {
      console.error('Missing required elements for capture or video not ready');
      console.log('Video ready:', isVideoReady);
      console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
      return null;
    }
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      console.log('Capturing photo, video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        throw new Error('Video not ready - no dimensions');
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Photo captured, data length:', imageData.length);
        return imageData;
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Capture failed",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive"
      });
    }
    return null;
  }, [stream, isVideoReady, toast]);

  // Initialize camera when component mounts
  useEffect(() => {
    console.log('Camera manager initialized');
    startCamera();
    
    return () => {
      console.log('Camera manager cleanup...');
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Clean up video event listeners
      if (videoRef.current && (videoRef.current as any)._cleanup) {
        (videoRef.current as any)._cleanup();
      }
    };
  }, []);

  return {
    videoRef,
    canvasRef,
    stream,
    isLoading,
    cameraError,
    isVideoReady,
    stopCamera,
    startCamera,
    capturePhoto
  };
};
