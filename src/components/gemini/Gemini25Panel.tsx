import React from 'react';
import GeminiChatInterface from '@/components/gemini/GeminiChatInterface';
import { GeminiUsageWrapper } from '@/components/gemini/GeminiUsageWrapper';

interface Gemini25PanelProps {
  content: string;
  onApplyChanges: (newContent: string) => void;
}

/**
 * Main panel for Gemini 2.5 AI integration
 * Wraps the chat interface with usage tracking
 */
const Gemini25Panel: React.FC<Gemini25PanelProps> = ({ content, onApplyChanges }) => {
  return (
    <GeminiUsageWrapper 
      featureId="ai-gemini" 
      onUseFeature={() => console.log('Gemini feature used')}
      className="h-full"
    >
      <GeminiChatInterface 
        content={content} 
        onApplyChanges={onApplyChanges} 
        className="h-full"
      />  
    </GeminiUsageWrapper>
  );
};

export default Gemini25Panel;
