
import React from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeechToTextButton from "../SpeechToTextButton";
import OCRButton from "../ocr/OCRButton";
import OCRCameraButton from "../ocr/OCRCameraButton";

interface ToolbarNavigationProps {
  toggleSidebar: () => void;
  onSpeechTranscript?: (transcript: string) => void;
  onOCRClick: () => void;
  onCameraOCRClick?: () => void;
  isCameraOCRProcessing?: boolean;
}

const ToolbarNavigation: React.FC<ToolbarNavigationProps> = ({
  toggleSidebar,
  onSpeechTranscript,
  onOCRClick,
  onCameraOCRClick,
  isCameraOCRProcessing = false
}) => {
  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Sidebar toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2"
        title="Toggle Notes Sidebar"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>

      <div className="w-px h-6 bg-white/10"></div>

      {/* OCR, Camera OCR and Speech to Text */}
      <div className="flex items-center gap-1">
        <OCRButton onClick={onOCRClick} />
        
        {onCameraOCRClick && (
          <OCRCameraButton 
            onClick={onCameraOCRClick}
            isProcessing={isCameraOCRProcessing}
          />
        )}
        
        {onSpeechTranscript && (
          <SpeechToTextButton 
            onTranscript={onSpeechTranscript}
            className="p-1.5 md:p-2 h-8 w-8 text-slate-300 hover:text-white hover:bg-white/10"
          />
        )}
      </div>
    </div>
  );
};

export default ToolbarNavigation;
