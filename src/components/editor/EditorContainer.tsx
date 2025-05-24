import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEditorHeight } from "@/hooks/useEditorHeight";
import { cn } from "@/lib/utils";
import TextEditorToolbar from "../TextEditorToolbar";
import MobileToolbar from "../mobile/MobileToolbar";
import { useIsMobileDevice } from "@/hooks/useIsMobileDevice";

interface EditorContainerProps {
  content: string;
  setContent: (content: string) => void;
  execCommand: (command: string, value?: string | null) => void;
  handleSave: () => void;
  toggleLeftSidebar: () => void;
  toggleAISidebar: () => void;
  isLeftSidebarOpen: boolean;
  isAISidebarOpen: boolean;
  lastSaved: Date | null;
  isFocusMode: boolean;
  toggleFocusMode: () => void;
  isAIDialogOpen?: boolean;
  setIsAIDialogOpen?: (open: boolean) => void;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  content,
  setContent,
  execCommand,
  handleSave,
  toggleLeftSidebar,
  toggleAISidebar,
  isLeftSidebarOpen,
  isAISidebarOpen,
  lastSaved,
  isFocusMode,
  toggleFocusMode,
  isAIDialogOpen,
  setIsAIDialogOpen
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isMobileDevice = useIsMobileDevice();
  const { toast } = useToast();
  const [speechTranscript, setSpeechTranscript] = useState("");
  const editorHeight = useEditorHeight(isMobileDevice);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand("insertText", false, text);
    handleInput();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      event.preventDefault();
      handleSave();
    }
  };

  const handleSpeechTranscript = (transcript: string) => {
    setSpeechTranscript(transcript);
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(transcript + " "));
        
        // Move cursor to end of inserted text
        range.setStartAfter(range.endContainer);
        range.setEndAfter(range.endContainer);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update content
        setContent(editorRef.current.innerHTML);
      } else {
        // If no selection, append to end
        editorRef.current.innerHTML += transcript + " ";
        setContent(editorRef.current.innerHTML);
      }
      
      editorRef.current.focus();
    }
  };

  const handleApplyAIChanges = (newContent: string) => {
    setContent(newContent);
    if (editorRef.current) {
      editorRef.current.innerHTML = newContent;
    }
  };

  return (
    <div className={cn(
      "glass-panel-dark rounded-xl overflow-hidden flex flex-col transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-white/5",
      isFocusMode ? "shadow-[0_20px_60px_rgb(147,51,234,0.3)] border-purple-500/20" : ""
    )} style={{ height: `${editorHeight}px` }}>
      
      {/* Toolbar */}
      {isMobileDevice ? (
        <MobileToolbar
          execCommand={execCommand}
          handleSave={handleSave}
          toggleSidebar={toggleLeftSidebar}
          toggleAI={toggleAISidebar}
          isSidebarOpen={isLeftSidebarOpen}
          isAISidebarOpen={isAISidebarOpen}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
        />
      ) : (
        <TextEditorToolbar
          execCommand={execCommand}
          handleSave={handleSave}
          toggleSidebar={toggleLeftSidebar}
          toggleAI={toggleAISidebar}
          isSidebarOpen={isLeftSidebarOpen}
          isAISidebarOpen={isAISidebarOpen}
          lastSaved={lastSaved}
          isFocusMode={isFocusMode}
          toggleFocusMode={toggleFocusMode}
          onSpeechTranscript={handleSpeechTranscript}
          onToggleAIAgent={() => setIsAIDialogOpen?.(!isAIDialogOpen)}
          isAIAgentVisible={isAIDialogOpen}
          content={content}
          onApplyAIChanges={handleApplyAIChanges}
        />
      )}

      {/* Editor Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div 
          ref={editorRef}
          className={cn(
            "flex-1 p-4 md:p-6 lg:p-8 text-white overflow-y-auto resize-none border-none outline-none transition-all duration-300",
            "text-base md:text-lg leading-relaxed",
            "prose prose-invert max-w-none",
            "focus:ring-0 focus:outline-none",
            "[&>*]:mb-4 [&>*:last-child]:mb-0",
            "[&_p]:text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white",
            "[&_ul]:text-white [&_ol]:text-white [&_li]:text-white",
            "[&_strong]:text-white [&_em]:text-white",
            isFocusMode ? "bg-black/90" : "bg-black/50"
          )}
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          style={{ 
            minHeight: 'calc(100% - 2rem)',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
};

export default EditorContainer;
