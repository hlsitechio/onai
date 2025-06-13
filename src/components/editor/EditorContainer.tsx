
import React from "react";
import { cn } from "@/lib/utils";
import TiptapEditor from "./TiptapEditor";
import TextEditorToolbar from "../TextEditorToolbar";

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
  isAIDialogOpen: boolean;
  setIsAIDialogOpen: (open: boolean) => void;
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
  return (
    <div className={cn(
      "bg-black/30 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden transition-all duration-300",
      "h-[calc(100vh-2rem)] flex flex-col"
    )}>
      {/* Only show the basic navigation toolbar, not the formatting controls */}
      <div className="flex items-center justify-between p-2 lg:p-3 border-b border-white/5 bg-[#03010a]">
        {/* Navigation section - only sidebar toggle and utilities */}
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={toggleLeftSidebar}
            className="text-slate-300 hover:text-white hover:bg-white/10 p-1.5 md:p-2 rounded"
            title="Toggle Notes Sidebar"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Status section */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {lastSaved && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span>Saved {Math.round((Date.now() - lastSaved.getTime()) / 1000 / 60)} min ago</span>
            </div>
          )}

          <button
            onClick={toggleFocusMode}
            className={cn(
              "p-1.5 md:p-2 rounded",
              isFocusMode 
                ? "text-purple-300 bg-purple-500/20 hover:bg-purple-500/30" 
                : "text-slate-300 hover:text-white hover:bg-white/10"
            )}
            title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
            </svg>
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 md:p-2 px-3 md:px-4 rounded"
            title="Save Note (Ctrl+S)"
          >
            <svg className="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3-3-3m3-3v12" />
            </svg>
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* TiptapEditor with its own integrated toolbar */}
      <div className="flex-1 overflow-hidden">
        <TiptapEditor
          content={content}
          setContent={setContent}
          isFocusMode={isFocusMode}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default EditorContainer;
