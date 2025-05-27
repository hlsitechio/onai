
import React from "react";
import ToolbarNavigation from "./toolbar/ToolbarNavigation";
import ToolbarActions from "./toolbar/ToolbarActions";
import ToolbarStatus from "./toolbar/ToolbarStatus";

interface TextEditorToolbarProps {
  execCommand: (command: string) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  toggleGeminiPanel: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  isGeminiPanelOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  content: string;
  onApplyAIChanges: (newContent: string) => void;
  onNewNote?: () => void;
  onExportNote?: () => void;
  onImportNote?: () => void;
}

const TextEditorToolbar: React.FC<TextEditorToolbarProps> = ({
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  toggleGeminiPanel,
  isLeftSidebarOpen,
  isAISidebarOpen,
  isGeminiPanelOpen,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  content,
  onApplyAIChanges,
  onNewNote,
  onExportNote,
  onImportNote
}) => {
  // Calculate word count
  const wordCount = content.trim() 
    ? content.trim().split(/\s+/).length 
    : 0;
    
  // Extract title from content (first line, removing markdown heading symbols)
  const noteTitle = content.trim()
    ? content.split('\n')[0].replace(/^#+ /, '').substring(0, 50)
    : 'Untitled Note';

  const handleExportNote = () => {
    if (onExportNote) {
      onExportNote();
    } else {
      // Default export functionality
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'note.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportNote = () => {
    if (onImportNote) {
      onImportNote();
    } else {
      // Default import functionality
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.md';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileContent = e.target?.result as string;
            onApplyAIChanges(fileContent);
          };
          reader.readAsText(file);
        }
      };
      input.click();
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between p-2 lg:p-3 border-b border-white/5 bg-[#03010a] gap-2">
      {/* Navigation section */}
      <ToolbarNavigation
        toggleSidebar={toggleLeftSidebar}
        toggleAISidebar={toggleAISidebar}
        toggleGeminiPanel={toggleGeminiPanel}
        isAISidebarOpen={isAISidebarOpen}
        isGeminiPanelOpen={isGeminiPanelOpen}
        onSpeechTranscript={(transcript) => {
          // Handle speech transcript if needed
          const newContent = content + (content.endsWith('\n') || content === '' ? '' : '\n') + transcript + ' ';
          onApplyAIChanges(newContent);
        }}
        onOCRClick={() => {
          // Handle OCR click if needed
        }}
        onNewNote={onNewNote}
        onExportNote={handleExportNote}
        onImportNote={handleImportNote}
      />

      {/* Actions section */}
      <ToolbarActions 
        execCommand={execCommand} 
        isFocusMode={isFocusMode}
      />

      {/* Status section */}
      <ToolbarStatus
        handleSave={handleSave}
        lastSaved={lastSaved}
        isFocusMode={isFocusMode}
        toggleFocusMode={toggleFocusMode}
        wordCount={wordCount}
        content={content}
        title={noteTitle}
      />
    </div>
  );
};

export default TextEditorToolbar;
