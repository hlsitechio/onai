
import React, { useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OCRCameraCaptureProps {
  onPhotoCapture: (imageData: string) => void;
  onClose: () => void;
}

const OCRCameraCapture: React.FC<OCRCameraCaptureProps> = ({
  onPhotoCapture,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera for better text capture
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera access failed",
        description: "Please grant camera permission to capture text images.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
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
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedPhoto) {
      onPhotoCapture(capturedPhoto);
      onClose();
    }
  }, [capturedPhoto, onPhotoCapture, onClose]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 backdrop-blur-sm">
        <h2 className="text-white font-medium">Capture Text</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Camera/Photo View */}
      <div className="flex-1 relative flex items-center justify-center">
        {!capturedPhoto ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
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
        ) : (
          <img
            src={capturedPhoto}
            alt="Captured text"
            className="w-full h-full object-contain"
          />
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
            >
              <RotateCcw className="h-4 w-4" />
              Retake
            </Button>
            <Button
              onClick={confirmPhoto}
              className="flex items-center gap-2 bg-noteflow-600 hover:bg-noteflow-700"
            >
              <Check className="h-4 w-4" />
              Use Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRCameraCapture;
