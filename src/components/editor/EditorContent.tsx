
import React from "react";
import { cn } from "@/lib/utils";
import PlateEditor from "./PlateEditor";

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
      "relative h-full w-full",
      "bg-gradient-to-br from-[#03010a] to-[#0a0518]"
    )}>
      <PlateEditor
        content={content}
        setContent={setContent}
        isFocusMode={isFocusMode}
      />
    </div>
  );
};

export default EditorContent;
