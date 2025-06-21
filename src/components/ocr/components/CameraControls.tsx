
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check, Loader2 } from "lucide-react";

interface CameraControlsProps {
  capturedPhoto: string | null;
  isLoading: boolean;
  stream: MediaStream | null;
  cameraError: string | null;
  isVideoReady: boolean;
  isProcessing: boolean;
  onCapture: () => void;
  onRetake: () => void;
  onConfirm: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  capturedPhoto,
  isLoading,
  stream,
  cameraError,
  isVideoReady,
  isProcessing,
  onCapture,
  onRetake,
  onConfirm
}) => {
  if (!capturedPhoto) {
    return (
      <div className="flex justify-center">
        <Button
          onClick={onCapture}
          disabled={isLoading || !stream || !!cameraError || !isVideoReady}
          className="w-16 h-16 rounded-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
        >
          <Camera className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <Button
        onClick={onRetake}
        variant="outline"
        className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10"
        disabled={isProcessing}
      >
        <RotateCcw className="h-4 w-4" />
        Retake
      </Button>
      <Button
        onClick={onConfirm}
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
  );
};

export default CameraControls;
