
import React from "react";

interface EditorPlaceholderProps {
  content: string;
}

const EditorPlaceholder: React.FC<EditorPlaceholderProps> = ({ content }) => {
  if (content) return null;

  return (
    <div className="absolute top-[4rem] left-4 md:left-6 lg:left-8 text-slate-400 pointer-events-none text-base md:text-lg">
      Start writing your note...
    </div>
  );
};

export default EditorPlaceholder;
