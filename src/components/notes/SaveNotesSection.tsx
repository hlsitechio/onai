
import React from 'react';
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveNotesSectionProps {
  onSave: () => void;
}

const SaveNotesSection: React.FC<SaveNotesSectionProps> = ({ onSave }) => {
  return (
    <div className="p-4 animate-slideDown" style={{ animationDelay: '0.3s' }}>
      <Button 
        variant="default" 
        size="sm" 
        onClick={onSave} 
        className="w-full mb-3 sm:mb-5 bg-gradient-to-r from-noteflow-600 to-noteflow-400 hover:from-noteflow-500 hover:to-noteflow-300 text-white border-none shadow-md hover:shadow-lg transition-all duration-300 group text-xs sm:text-sm relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse-light"></div>
        <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" /> 
        Save Current Note
      </Button>
    </div>
  );
};

export default SaveNotesSection;
