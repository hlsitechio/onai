
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OCRCameraCaptureProps {
  onPhotoCapture: (imageData: string) => void;
  onClose: () => void;
  isProcessing?: boolean;
  ocrProgress?: number;
}

const OCRCameraCapture: React.FC<OCRCameraCaptureProps> = ({
  onPhotoCapture,
  onClose,
  isProcessing = false,
  ocrProgress = 0
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
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
      return;
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
        setCapturedPhoto(imageData);
        stopCamera();
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Capture failed",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive"
      });
    }
  }, [stream, isVideoReady, stopCamera, toast]);

  const retakePhoto = useCallback(() => {
    console.log('Retaking photo');
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedPhoto) {
      console.log('Confirming photo and starting OCR...');
      onPhotoCapture(capturedPhoto);
    }
  }, [capturedPhoto, onPhotoCapture]);

  const handleClose = useCallback(() => {
    console.log('Closing camera modal...');
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Initialize camera when component mounts
  useEffect(() => {
    console.log('OCRCameraCapture component mounted');
    startCamera();
    
    return () => {
      console.log('OCRCameraCapture component unmounting...');
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      // Clean up video event listeners
      if (videoRef.current && (videoRef.current as any)._cleanup) {
        (videoRef.current as any)._cleanup();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
        <h2 className="text-white font-medium">
          {isProcessing ? 'Processing Text...' : 'Capture Text'}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-white hover:bg-white/10"
          disabled={isProcessing}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Camera/Photo View */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {!capturedPhoto ? (
          <>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <span>Starting camera...</span>
              </div>
            ) : cameraError ? (
              <div className="flex flex-col items-center justify-center text-white text-center p-6">
                <Camera className="h-12 w-12 mb-4 text-red-400" />
                <h3 className="text-lg font-medium mb-2">Camera Error</h3>
                <p className="text-sm text-white/70 mb-4">{cameraError}</p>
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Try Again
                </Button>
              </div>
            ) : stream ? (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  style={{ 
                    display: isVideoReady ? 'block' : 'none',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                />
                
                {/* Loading overlay while video is not ready */}
                {!isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black">
                    <div className="flex flex-col items-center justify-center text-white">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <span>Preparing camera...</span>
                    </div>
                  </div>
                )}
                
                {/* Capture Guide Overlay */}
                {isVideoReady && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="border-2 border-white/50 border-dashed rounded-lg w-4/5 h-2/3 flex items-center justify-center">
                      <div className="text-white/70 text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">Align text within this frame</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-white">
                <Camera className="h-12 w-12 mb-4 text-white/50" />
                <span>Initializing camera...</span>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={capturedPhoto}
              alt="Captured text"
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
                  <p className="text-white mb-2">Extracting text...</p>
                  <div className="w-48 bg-white/20 rounded-full h-2 mb-2">
                    <div 
                      className="bg-noteflow-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                  <p className="text-white/70 text-sm">{ocrProgress}%</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/80 backdrop-blur-sm">
        {!capturedPhoto ? (
          <div className="flex justify-center">
            <Button
              onClick={capturePhoto}
              disabled={isLoading || !stream || !!cameraError || !isVideoReady}
              className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
              disabled={isProcessing}
            >
              <RotateCcw className="h-4 w-4" />
              Retake
            </Button>
            <Button
              onClick={confirmPhoto}
              className="flex items-center gap-2 bg-noteflow-600 hover:bg-noteflow-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isProcessing ? 'Processing...' : 'Extract Text'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRCameraCapture;
