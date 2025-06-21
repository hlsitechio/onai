
import React from 'react';
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraVideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isLoading: boolean;
  cameraError: string | null;
  stream: MediaStream | null;
  isVideoReady: boolean;
  onRetry: () => void;
}

const CameraVideoDisplay: React.FC<CameraVideoDisplayProps> = ({
  videoRef,
  isLoading,
  cameraError,
  stream,
  isVideoReady,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <span>Starting camera...</span>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center text-white text-center p-6">
        <Camera className="h-12 w-12 mb-4 text-red-400" />
        <h3 className="text-lg font-medium mb-2">Camera Error</h3>
        <p className="text-sm text-white/70 mb-4">{cameraError}</p>
        <Button
          onClick={onRetry}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!stream) {
    return (
      <div className="flex flex-col items-center justify-center text-white">
        <Camera className="h-12 w-12 mb-4 text-white/50" />
        <span>Initializing camera...</span>
      </div>
    );
  }

  return (
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
  );
};

export default CameraVideoDisplay;
