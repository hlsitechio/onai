
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIPosition } from '@/hooks/useAIAgent';

interface AICommandCenterProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedText: string;
  cursorPosition: number;
  isVisible: boolean;
  onClose: () => void;
  position: AIPosition;
}

const AICommandCenter: React.FC<AICommandCenterProps> = ({
  content,
  onContentChange,
  selectedText,
  cursorPosition,
  isVisible,
  onClose,
  position
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just append the prompt as a response
      const aiResponse = `\n\n**AI Response to "${prompt}":**\n${selectedText ? `Based on your selected text: "${selectedText}"` : 'Processing your request...'}\n\nThis is a simulated response. The AI integration will be implemented in the next phase.\n`;
      
      onContentChange(content + aiResponse);
      setPrompt('');
      onClose();
    } catch (error) {
      console.error('AI processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 w-96 max-w-[calc(100vw-2rem)]"
      style={{
        left: Math.min(position.x, window.innerWidth - 400),
        top: Math.min(position.y, window.innerHeight - 300),
      }}
    >
      <Card className="bg-black/90 backdrop-blur-xl border-noteflow-500/30 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-noteflow-400" />
              AI Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/10 p-1 h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {selectedText && (
            <div className="text-xs text-gray-400 bg-white/5 rounded p-2 mt-2">
              Selected: "{selectedText.substring(0, 50)}..."
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask AI to help with your writing..."
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 resize-none"
              rows={3}
              disabled={isProcessing}
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="flex-1 bg-noteflow-500 hover:bg-noteflow-600 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Quick actions:</p>
            <div className="flex flex-wrap gap-1">
              {['Improve writing', 'Fix grammar', 'Summarize', 'Expand'].map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(action)}
                  className="text-xs h-6 px-2 border-white/20 text-gray-300 hover:bg-white/10"
                  disabled={isProcessing}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICommandCenter;
