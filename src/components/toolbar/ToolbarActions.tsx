
import React from "react";
import { Separator } from "@/components/ui/separator";
import FindReplaceDialog from "./FindReplaceDialog";
import FontControls from "./FontControls";
import ColorPicker from "./ColorPicker";
import FormattingButtons from "./components/FormattingButtons";
import HeadingButtons from "./components/HeadingButtons";
import ContentButtons from "./components/ContentButtons";
import FileOperationButtons from "./components/FileOperationButtons";
import DisabledButtons from "./components/DisabledButtons";
import { handleFind, handleReplace } from './utils/searchUtils';
import { handleFontFamilyChange, handleFontSizeChange, handleColorChange } from './utils/styleUtils';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

interface ToolbarActionsProps {
  execCommand: (command: string, value?: string | null) => void;
  isFocusMode: boolean;
}

const ToolbarActions: React.FC<ToolbarActionsProps> = ({
  execCommand,
  isFocusMode
}) => {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div className="flex flex-wrap items-center gap-1 md:gap-2">
      {/* Essential Formatting Group - Always visible */}
      <FormattingButtons />
      <Separator orientation="vertical" className="h-6 bg-white/10" />
      
      {/* Structure Group - Lists, tables, code blocks */}
      <ContentButtons />
      <Separator orientation="vertical" className="h-6 bg-white/10" />
      
      {/* Heading Group - Text hierarchy */}
      <HeadingButtons />
      <Separator orientation="vertical" className="h-6 bg-white/10" />
      
      {/* Color Controls - Visible on larger screens */}
      <div className="hidden md:flex items-center">
        <ColorPicker onColorChange={handleColorChange} />
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
      </div>

      {/* Font Controls - Typography settings */}
      <div className="hidden lg:flex items-center">
        <FontControls
          onFontFamilyChange={handleFontFamilyChange}
          onFontSizeChange={handleFontSizeChange}
        />
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
      </div>

      {/* Find & Replace - Utility function */}
      <div className="hidden lg:flex items-center">
        <FindReplaceDialog 
          onFind={handleFind}
          onReplace={handleReplace}
        />
      </div>
      
      {/* File Operations - Moved to ToolbarNavigation */}
      {/* <FileOperationButtons /> */}
    </div>
  );
};

export default ToolbarActions;
