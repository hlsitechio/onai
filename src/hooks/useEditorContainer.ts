
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
    if (!transcript.trim()) return;
    
    // Insert transcript at current cursor position or append to content
    const newContent = content + (content.endsWith('\n') || content === '' ? '' : '\n') + transcript + ' ';
    setContent(newContent);
  };

  const handleApplyAIChanges = (newContent: string) => {
    if (typeof newContent !== 'string') {
      console.error('Invalid content type provided to handleApplyAIChanges');
      return;
    }
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
