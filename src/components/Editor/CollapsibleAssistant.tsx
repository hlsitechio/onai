import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  Search, 
  Settings, 
  Sparkles,
  Zap,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import WritingSuggestions from './WritingSuggestions';

interface CollapsibleAssistantProps {
  content: string;
  onSuggestionApply: (original: string, suggestion: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const CollapsibleAssistant: React.FC<CollapsibleAssistantProps> = ({
  content,
  onSuggestionApply,
  onCollapseChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  const handleToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <div className="w-16 h-full flex flex-col bg-sidebar border-l border-border/50 backdrop-blur-md">
          {/* Toggle Button */}
          <div className="p-3 border-b border-border/50">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggle(false)}
                  className="w-10 h-10 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
                >
                  <PanelRightOpen className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Expand Assistant</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Icon-only Tools */}
          <div className="flex-1 p-3 space-y-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
                >
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Writing Suggestions</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
                >
                  <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Generate Ideas</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
                >
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Research Topic</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
                >
                  <Settings className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Tone Adjustment</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Analytics Icon */}
          {content.length > 0 && (
            <div className="p-3 border-t border-border/50">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-10 h-10 glass shadow-medium rounded-lg flex flex-col items-center justify-center">
                    <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      {content.split(' ').filter(w => w.length > 0).length}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Word count: {content.split(' ').filter(w => w.length > 0).length}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="w-80 h-full flex flex-col bg-sidebar border-l border-border/50 backdrop-blur-md">
      {/* Header with Toggle */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-purple-800 dark:text-purple-300">AI Power Tools</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleToggle(true)}
            className="w-8 h-8 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
          >
            <PanelRightClose className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Next-generation features</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        <WritingSuggestions
          content={content}
          onSuggestionApply={onSuggestionApply}
        />

        <Card className="glass shadow-large">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-purple-800 dark:text-purple-300">AI Power Tools</h3>
                <p className="text-xs text-purple-600 dark:text-purple-400">Next-generation features</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-slate-600/20 dark:hover:bg-slate-600/30 dark:text-slate-200">
                <Bot className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                Generate Ideas
                <Badge className="ml-auto bg-purple-100/20 backdrop-blur-sm text-purple-700 border-0 dark:bg-purple-900/30 dark:text-purple-300">NEW</Badge>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-slate-600/20 dark:hover:bg-slate-600/30 dark:text-slate-200">
                <Search className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Research Topic
                <Badge className="ml-auto bg-blue-100/20 backdrop-blur-sm text-blue-700 border-0 dark:bg-blue-900/30 dark:text-blue-300">PRO</Badge>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-slate-600/20 dark:hover:bg-slate-600/30 dark:text-slate-200">
                <Settings className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                Tone Adjustment
                <Badge className="ml-auto bg-pink-100/20 backdrop-blur-sm text-pink-700 border-0 dark:bg-pink-900/30 dark:text-pink-300">AI</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

        {content.length > 0 && (
          <Card className="glass shadow-medium">
            <CardContent className="p-5">
              <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2 dark:text-slate-200">
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Writing Analytics
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg border-0 dark:bg-slate-700/30">
                  <span className="font-medium dark:text-slate-300">Words:</span>
                  <Badge variant="secondary" className="bg-blue-100/20 backdrop-blur-sm text-blue-700 border-0 dark:bg-blue-900/30 dark:text-blue-300">
                    {content.split(' ').filter(w => w.length > 0).length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg border-0 dark:bg-slate-700/30">
                  <span className="font-medium dark:text-slate-300">Characters:</span>
                  <Badge variant="secondary" className="bg-purple-100/20 backdrop-blur-sm text-purple-700 border-0 dark:bg-purple-900/30 dark:text-purple-300">
                    {content.length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg border-0 dark:bg-slate-700/30">
                  <span className="font-medium dark:text-slate-300">Reading time:</span>
                  <Badge variant="secondary" className="bg-green-100/20 backdrop-blur-sm text-green-700 border-0 dark:bg-green-900/30 dark:text-green-300">
                    ~{Math.ceil(content.split(' ').length / 200)} min
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollapsibleAssistant;
