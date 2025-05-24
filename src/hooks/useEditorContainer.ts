
import { useRef, useEffect } from "react";

interface UseEditorContainerProps {
  content: string;
  setContent: (content: string) => void;
}

export const useEditorContainer = ({ content, setContent }: UseEditorContainerProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleSpeechTranscript = (transcript: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        // Create text node and insert it
        const textNode = document.createTextNode(transcript + " ");
        range.insertNode(textNode);
        
        // Move cursor to end of inserted text
        range.setStartAfter(textNode);
        range.collapse(true);
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

  return {
    editorRef,
    handleSpeechTranscript,
    handleApplyAIChanges
  };
};
