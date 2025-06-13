
import React from "react";
import TiptapEditor from "./editor/TiptapEditor";
import { cn } from "@/lib/utils";

interface EditableContentProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  onSpeechTranscript?: (transcript: string) => void;
}

const EditableContent: React.FC<EditableContentProps> = ({
  content,
  setContent,
  isFocusMode = false,
  onSpeechTranscript
}) => {
  const handleSpeechTranscript = (transcript: string) => {
    if (!transcript.trim()) return;
    
    // Insert transcript at the end of current content
    const newContent = content + (content ? '<p>' + transcript + '</p>' : '<p>' + transcript + '</p>');
    setContent(newContent);
    
    // Call the original handler if provided
    onSpeechTranscript?.(transcript);
  };

  return (
    <div className={cn(
      "relative h-full w-full mx-auto",
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

export default EditableContent;
