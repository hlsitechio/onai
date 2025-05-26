
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
      {/* Find & Replace */}
      <div className="hidden lg:flex items-center">
        <FindReplaceDialog 
          onFind={handleFind}
          onReplace={handleReplace}
        />
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
      </div>

      {/* Font Controls */}
      <div className="hidden xl:flex items-center">
        <FontControls
          onFontFamilyChange={handleFontFamilyChange}
          onFontSizeChange={handleFontSizeChange}
        />
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />
      </div>

      {/* Import/Export */}
      <FileOperationButtons />
      <Separator orientation="vertical" className="h-6 bg-white/10 hidden lg:block" />

      {/* Text Formatting Group */}
      <FormattingButtons />

      <Separator orientation="vertical" className="h-6 bg-white/10" />

      {/* Color Controls */}
      <div className="hidden lg:flex items-center">
        <ColorPicker onColorChange={handleColorChange} />
      </div>

      {/* Heading Group */}
      <HeadingButtons />

      <Separator orientation="vertical" className="h-6 bg-white/10 hidden lg:block" />

      {/* List and Structure Group */}
      <ContentButtons />

      {/* Alignment buttons - disabled for textarea */}
      <Separator orientation="vertical" className="h-6 bg-white/10 hidden xl:block" />
      <DisabledButtons />
    </div>
  );
};

export default ToolbarActions;
