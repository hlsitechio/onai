
import React, { useRef, useEffect } from 'react';
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoteRenameInputProps {
  newName: string;
  setNewName: (name: string) => void;
  onSubmit: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const NoteRenameInput: React.FC<NoteRenameInputProps> = ({
  newName,
  setNewName,
  onSubmit,
  onCancel,
  onKeyDown
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  return (
    <div className="flex-1 flex items-center" onClick={(e) => e.stopPropagation()}>
      <input
        ref={inputRef}
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onKeyDown={onKeyDown}
        className="w-full bg-black/30 border border-noteflow-500/50 rounded text-sm text-white px-2 py-1 focus:outline-none focus:ring-1 focus:ring-noteflow-500"
        placeholder="Enter note title"
      />
      <div className="flex gap-1 ml-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={onSubmit}
          className="h-6 w-6 p-0.5 hover:bg-noteflow-500/20 rounded-full hover:text-noteflow-400 transition-all"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancel}
          className="h-6 w-6 p-0.5 hover:bg-red-500/20 rounded-full hover:text-red-400 transition-all"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default NoteRenameInput;
