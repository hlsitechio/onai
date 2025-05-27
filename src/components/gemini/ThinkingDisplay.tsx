import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Check } from 'lucide-react';

interface ThinkingDisplayProps {
  thinking: string;
  result?: string;
}

/**
 * Component to display the step-by-step thinking process of Gemini 2.5 Flash
 * Shows both the reasoning steps and the final result
 */
const ThinkingDisplay: React.FC<ThinkingDisplayProps> = ({ thinking, result }) => {
  const [activeTab, setActiveTab] = useState<string>('thinking');
  
  // Format thinking steps to be more readable
  const formatThinking = (rawThinking: string): React.ReactNode => {
    // Split by numbered steps if they exist
    if (rawThinking.match(/\d+\.\s/)) {
      const steps = rawThinking.split(/(\d+\.\s)/).filter(Boolean);
      
      return (
        <div className="space-y-4">
          {steps.map((step, index) => {
            // Check if this is a step number
            if (step.match(/\d+\.\s/)) {
              return (
                <div key={index} className="flex items-start">
                  <div className="bg-blue-500/30 text-blue-300 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2 mt-0.5">
                    {step.trim().replace('.', '')}
                  </div>
                  {index + 1 < steps.length && (
                    <div className="text-white text-sm flex-1">{steps[index + 1]}</div>
                  )}
                </div>
              );
            }
            return null;
          }).filter(Boolean)}
        </div>
      );
    }
    
    // If no numbered steps, split by line breaks
    return (
      <div className="space-y-3">
        {rawThinking.split('\n').map((line, index) => (
          <p key={index} className="text-white text-sm">
            {line}
          </p>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-full">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full h-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 mb-3 bg-black/30">
          <TabsTrigger value="thinking" className="data-[state=active]:bg-purple-900/30">
            <Brain className="h-4 w-4 mr-2" />
            Thinking Process
          </TabsTrigger>
          <TabsTrigger value="result" className="data-[state=active]:bg-green-900/30">
            <Check className="h-4 w-4 mr-2" />
            Final Result
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="thinking" className="flex-1 overflow-auto">
          <div className="p-3 bg-black/20 rounded-lg text-sm">
            <div className="text-blue-300 mb-3 pb-2 border-b border-blue-500/20 font-medium flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Step-by-step reasoning
            </div>
            {formatThinking(thinking)}
          </div>
        </TabsContent>
        
        <TabsContent value="result" className="flex-1 overflow-auto">
          <div className="p-3 bg-black/20 rounded-lg text-sm">
            <div className="text-green-300 mb-3 pb-2 border-b border-green-500/20 font-medium flex items-center">
              <Check className="h-4 w-4 mr-2" />
              AI Analysis Result
            </div>
            <div className="whitespace-pre-wrap text-white">
              {result || "No result available yet."}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-2 text-xs text-slate-500">
        Gemini 2.5 Flash thinking capabilities show how the AI reaches its conclusions
      </div>
    </div>
  );
};

export default ThinkingDisplay;
