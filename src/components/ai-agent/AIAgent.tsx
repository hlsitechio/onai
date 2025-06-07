
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  MessageSquare, 
  X,
  Wand2,
  Plus,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { callGeminiAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

interface AISuggestion {
  id: string;
  type: 'enhance' | 'amplify' | 'suggest' | 'continue';
  content: string;
  position: number;
  isApplied: boolean;
}

interface AIAgentProps {
  content: string;
  onContentChange: (newContent: string) => void;
  cursorPosition: number;
  isVisible: boolean;
}

const AIAgent: React.FC<AIAgentProps> = ({ 
  content, 
  onContentChange, 
  cursorPosition,
  isVisible 
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const { toast } = useToast();
  const agentRef = useRef<HTMLDivElement>(null);

  // Generate contextual suggestions based on current content and cursor position
  const generateSuggestions = async (selectedText?: string) => {
    if (!content.trim() && !selectedText) return;

    setIsProcessing(true);
    try {
      const contextText = selectedText || content.slice(Math.max(0, cursorPosition - 200), cursorPosition + 200);
      
      const suggestions = await Promise.all([
        // Enhance suggestion
        callGeminiAI(
          `Enhance this text with better clarity and depth: "${contextText}". Provide a concise improvement (max 2 sentences).`,
          content,
          'improve'
        ),
        // Amplify idea suggestion
        callGeminiAI(
          `Amplify and expand on this idea: "${contextText}". Provide a creative extension (max 2 sentences).`,
          content,
          'ideas'
        ),
        // Continue suggestion
        callGeminiAI(
          `Continue this thought naturally: "${contextText}". Provide a logical next sentence or two.`,
          content,
          'ideas'
        )
      ]);

      const newSuggestions: AISuggestion[] = [
        {
          id: `enhance-${Date.now()}`,
          type: 'enhance',
          content: suggestions[0],
          position: cursorPosition,
          isApplied: false
        },
        {
          id: `amplify-${Date.now()}`,
          type: 'amplify', 
          content: suggestions[1],
          position: cursorPosition,
          isApplied: false
        },
        {
          id: `continue-${Date.now()}`,
          type: 'continue',
          content: suggestions[2],
          position: cursorPosition,
          isApplied: false
        }
      ];

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: 'AI Agent Error',
        description: 'Failed to generate suggestions. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply a suggestion to the content
  const applySuggestion = (suggestion: AISuggestion) => {
    let newContent = content;
    
    if (suggestion.type === 'enhance' && selectedText) {
      // Replace selected text with enhanced version
      newContent = content.replace(selectedText, suggestion.content);
    } else if (suggestion.type === 'continue' || suggestion.type === 'amplify') {
      // Insert at cursor position
      const beforeCursor = content.slice(0, cursorPosition);
      const afterCursor = content.slice(cursorPosition);
      newContent = beforeCursor + (beforeCursor.endsWith(' ') ? '' : ' ') + suggestion.content + ' ' + afterCursor;
    }
    
    onContentChange(newContent);
    
    // Mark suggestion as applied
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? { ...s, isApplied: true } : s)
    );

    toast({
      title: 'Suggestion Applied',
      description: 'The AI suggestion has been added to your note.',
    });
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'enhance': return <Wand2 className="h-3 w-3" />;
      case 'amplify': return <TrendingUp className="h-3 w-3" />;
      case 'continue': return <ChevronRight className="h-3 w-3" />;
      default: return <Lightbulb className="h-3 w-3" />;
    }
  };

  // Get color for suggestion type
  const getSuggestionColor = (type: AISuggestion['type']) => {
    switch (type) {
      case 'enhance': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'amplify': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'continue': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30';
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={agentRef}
      className="fixed top-20 right-4 z-50 w-80 max-h-96 overflow-y-auto"
    >
      <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-noteflow-400" />
            <span className="text-sm font-medium text-white">AI Agent</span>
            <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
              Active
            </Badge>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <Button
            onClick={() => generateSuggestions(selectedText)}
            disabled={isProcessing}
            size="sm"
            className="bg-noteflow-500 hover:bg-noteflow-600 text-white flex-1"
          >
            {isProcessing ? (
              <>
                <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Generate Ideas
              </>
            )}
          </Button>
        </div>

        {/* Suggestions list */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              AI Suggestions
            </h4>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  suggestion.isApplied 
                    ? "bg-green-500/10 border-green-500/20 opacity-50" 
                    : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {getSuggestionIcon(suggestion.type)}
                    <span className="text-xs font-medium text-white capitalize">
                      {suggestion.type}
                    </span>
                  </div>
                  {!suggestion.isApplied && (
                    <Button
                      onClick={() => applySuggestion(suggestion)}
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2 text-xs bg-noteflow-500/20 hover:bg-noteflow-500/30 text-noteflow-300"
                    >
                      Apply
                    </Button>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {suggestion.content}
                </p>
                {suggestion.isApplied && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-green-300">Applied</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {suggestions.length === 0 && !isProcessing && (
          <div className="text-center py-6">
            <MessageSquare className="h-8 w-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">
              Click "Generate Ideas" to get AI suggestions for your content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAgent;
