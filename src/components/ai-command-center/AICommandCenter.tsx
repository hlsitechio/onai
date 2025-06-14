
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sparkles, 
  Wand2, 
  TrendingUp, 
  MessageSquare,
  ChevronRight,
  Plus,
  Bot,
  FileText,
  Clock,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import AIQuickActions from './AIQuickActions';
import AISuggestionsList from './AISuggestionsList';
import AIProcessingArea from './AIProcessingArea';
import { useAICommandCenter } from '@/hooks/useAICommandCenter';

interface AICommandCenterProps {
  content: string;
  onContentChange: (newContent: string) => void;
  selectedText: string;
  cursorPosition: number;
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'suggestions' | 'process'>('quick');
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    suggestions,
    isProcessing,
    result,
    streamingResult,
    generateSuggestions,
    applySuggestion,
    processAI,
    clearResult,
    stopProcessing
  } = useAICommandCenter({
    content,
    selectedText,
    cursorPosition,
    onContentChange
  });

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible && !isMinimized) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, isMinimized, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl transition-all duration-300",
        isMinimized ? "w-64 h-12" : "w-96 max-h-[80vh]"
      )}
      style={{
        left: `${Math.min(position.x, window.innerWidth - (isMinimized ? 256 : 384))}px`,
        top: `${Math.min(position.y, window.innerHeight - (isMinimized ? 48 : 600))}px`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-noteflow-400" />
          <span className="text-sm font-medium text-white">AI Command Center</span>
          <Badge variant="outline" className="bg-noteflow-500/20 text-noteflow-300 border-noteflow-500/30 text-xs">
            Active
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10"
          >
            {isMinimized ? (
              <Maximize2 className="h-3 w-3" />
            ) : (
              <Minimize2 className="h-3 w-3" />
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            {[
              { id: 'quick', label: 'Quick', icon: Sparkles },
              { id: 'suggestions', label: 'Ideas', icon: MessageSquare },
              { id: 'process', label: 'Process', icon: Wand2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-noteflow-500/20 text-noteflow-300 border-b border-noteflow-500"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <ScrollArea className="max-h-96">
            <div className="p-4">
              {activeTab === 'quick' && (
                <AIQuickActions
                  selectedText={selectedText}
                  onTextReplace={onContentChange}
                  onTextInsert={(text) => {
                    const beforeCursor = content.slice(0, cursorPosition);
                    const afterCursor = content.slice(cursorPosition);
                    onContentChange(beforeCursor + (beforeCursor.endsWith(' ') ? '' : ' ') + text + ' ' + afterCursor);
                  }}
                  isProcessing={isProcessing}
                />
              )}

              {activeTab === 'suggestions' && (
                <AISuggestionsList
                  suggestions={suggestions}
                  onGenerateSuggestions={generateSuggestions}
                  onApplySuggestion={applySuggestion}
                  isProcessing={isProcessing}
                  hasContent={!!content.trim()}
                />
              )}

              {activeTab === 'process' && (
                <AIProcessingArea
                  content={content}
                  result={result}
                  streamingResult={streamingResult}
                  onProcess={processAI}
                  onClearResult={clearResult}
                  onStopProcessing={stopProcessing}
                  onApplyChanges={onContentChange}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default AICommandCenter;
