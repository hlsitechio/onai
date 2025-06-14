
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus,
  MessageSquare,
  Wand2,
  TrendingUp,
  ChevronRight,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISuggestion {
  id: string;
  type: 'enhance' | 'amplify' | 'suggest' | 'continue';
  content: string;
  position: number;
  isApplied: boolean;
}

interface AISuggestionsListProps {
  suggestions: AISuggestion[];
  onGenerateSuggestions: () => void;
  onApplySuggestion: (suggestion: AISuggestion) => void;
  isProcessing: boolean;
  hasContent: boolean;
}

const AISuggestionsList: React.FC<AISuggestionsListProps> = ({
  suggestions,
  onGenerateSuggestions,
  onApplySuggestion,
  isProcessing,
  hasContent
}) => {
  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'enhance': return <Wand2 className="h-3 w-3" />;
      case 'amplify': return <TrendingUp className="h-3 w-3" />;
      case 'continue': return <ChevronRight className="h-3 w-3" />;
      default: return <Lightbulb className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Generate Button */}
      <Button
        onClick={onGenerateSuggestions}
        disabled={isProcessing || !hasContent}
        className="w-full bg-noteflow-500 hover:bg-noteflow-600 text-white"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating Ideas...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            Generate AI Ideas
          </>
        )}
      </Button>

      {/* Suggestions List */}
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
                    onClick={() => onApplySuggestion(suggestion)}
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
        <div className="text-center py-8">
          <MessageSquare className="h-8 w-8 text-slate-500 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-2">
            No suggestions yet
          </p>
          <p className="text-xs text-slate-500">
            {hasContent 
              ? "Click 'Generate AI Ideas' to get suggestions" 
              : "Add some content first to generate ideas"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default AISuggestionsList;
