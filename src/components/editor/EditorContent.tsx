
import React from "react";
import { cn } from "@/lib/utils";
import TiptapEditor from "./TiptapEditor";

interface EditorContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode: boolean;
}

const EditorContent: React.FC<EditorContentProps> = ({
  content,
  setContent,
  isFocusMode
}) => {
  return (
    <div className={cn(
      "relative flex-1 overflow-hidden",
      "bg-gradient-to-br from-[#03010a] to-[#0a0518]",
      "rounded-lg border border-white/5"
    )}>
      <TiptapEditor
        content={content}
        setContent={setContent}
        isFocusMode={isFocusMode}
      />
    </div>
  );
};

export default EditorContent;
