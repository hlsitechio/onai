
import React, { useState, useCallback } from 'react';
import { useCameraManager } from '@/hooks/useCameraManager';
import CameraHeader from './CameraHeader';
import CameraVideoDisplay from './CameraVideoDisplay';
import ProcessingOverlay from './ProcessingOverlay';
import CameraControls from './CameraControls';

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
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  const {
    videoRef,
    canvasRef,
    stream,
    isLoading,
    cameraError,
    isVideoReady,
    stopCamera,
    startCamera,
    capturePhoto
  } = useCameraManager();

  const handleCapturePhoto = useCallback(() => {
    const imageData = capturePhoto();
    if (imageData) {
      setCapturedPhoto(imageData);
      stopCamera();
    }
  }, [capturePhoto, stopCamera]);

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

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {/* Header */}
      <CameraHeader isProcessing={isProcessing} onClose={handleClose} />

      {/* Camera/Photo View */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {!capturedPhoto ? (
          <CameraVideoDisplay
            videoRef={videoRef}
            isLoading={isLoading}
            cameraError={cameraError}
            stream={stream}
            isVideoReady={isVideoReady}
            onRetry={startCamera}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={capturedPhoto}
              alt="Captured text"
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Processing Overlay */}
            <ProcessingOverlay 
              isProcessing={isProcessing} 
              ocrProgress={ocrProgress} 
            />
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/80 backdrop-blur-sm">
        <CameraControls
          capturedPhoto={capturedPhoto}
          isLoading={isLoading}
          stream={stream}
          cameraError={cameraError}
          isVideoReady={isVideoReady}
          isProcessing={isProcessing}
          onCapture={handleCapturePhoto}
          onRetake={retakePhoto}
          onConfirm={confirmPhoto}
        />
      </div>
    </div>
  );
};

export default OCRCameraCapture;
