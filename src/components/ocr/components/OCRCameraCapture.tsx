
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
  const [isMounted, setIsMounted] = useState(true);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (stream) {
      console.log('Stopping camera stream...');
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    if (!isMounted) return;
    
    try {
      setIsLoading(true);
      console.log('Starting camera...');
      
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (!isMounted) {
        // Component was unmounted while getting camera access
        mediaStream.getTracks().forEach(track => track.stop());
        return;
      }
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        console.log('Camera started successfully');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (isMounted) {
        toast({
          title: "Camera access failed",
          description: "Please grant camera permission to capture text images.",
          variant: "destructive"
        });
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  }, [isMounted, toast]); // Remove stream dependency to prevent loops

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(imageData);
        stopCamera();
        console.log('Photo captured successfully');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      toast({
        title: "Capture failed",
        description: "Failed to capture photo. Please try again.",
        variant: "destructive"
      });
    }
  }, [stopCamera, toast]);

  const retakePhoto = useCallback(() => {
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
    setIsMounted(false);
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Initialize camera when component mounts
  useEffect(() => {
    setIsMounted(true);
    startCamera();
    
    return () => {
      console.log('Camera component unmounting...');
      setIsMounted(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Empty dependency array - only run once

  // Don't render if not mounted
  if (!isMounted) {
    return null;
  }

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
      <div className="flex-1 relative flex items-center justify-center">
        {!capturedPhoto ? (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="ml-2 text-white">Starting camera...</span>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                
                {/* Capture Guide Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-white/50 border-dashed rounded-lg w-4/5 h-2/3 flex items-center justify-center">
                    <div className="text-white/70 text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Align text within this frame</p>
                    </div>
                  </div>
                </div>
              </>
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
              disabled={isLoading || !stream}
              className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200"
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
