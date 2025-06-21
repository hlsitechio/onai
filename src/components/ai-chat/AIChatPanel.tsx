
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Send, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callGeminiAI } from '@/utils/aiUtils';

interface AIChatPanelProps {
  onClose?: () => void;
  onApplyToEditor?: (content: string) => void;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ onClose, onApplyToEditor }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message for the AI assistant.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await callGeminiAI(input, '', 'chat');
      setResponse(result);
      toast({
        title: "AI Response Generated",
        description: "The AI has processed your request.",
      });
    } catch (error) {
      console.error('AI Chat error:', error);
      toast({
        title: "AI Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToEditor = () => {
    if (response && onApplyToEditor) {
      onApplyToEditor(response);
      toast({
        title: "Applied to Editor",
        description: "AI response has been added to your note.",
      });
    }
  };

  const clearChat = () => {
    setInput('');
    setResponse('');
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-noteflow-400" />
          <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI anything... (e.g., 'Help me write a blog post about React')"
          className="bg-black/30 border-white/10 text-white min-h-[80px]"
          disabled={isLoading}
        />
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
          >
            {isLoading ? (
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
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={clearChat}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Clear
          </Button>
        </div>
      </form>

      {response && (
        <Card className="bg-black/30 border-white/10 flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-noteflow-400">AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white text-sm whitespace-pre-wrap mb-4">
              {response}
            </div>
            
            {onApplyToEditor && (
              <Button 
                onClick={handleApplyToEditor}
                size="sm"
                className="bg-noteflow-500 hover:bg-noteflow-600 text-white"
              >
                Apply to Editor
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!response && !isLoading && (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
          Ask the AI assistant anything to get started
        </div>
      )}
    </div>
  );
};

export default AIChatPanel;
