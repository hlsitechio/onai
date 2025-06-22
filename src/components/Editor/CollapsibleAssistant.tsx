
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  Search, 
  Settings, 
  Sparkles,
  Zap 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import WritingSuggestions from './WritingSuggestions';

interface CollapsibleAssistantProps {
  content: string;
  onSuggestionApply: (original: string, suggestion: string) => void;
}

const CollapsibleAssistant: React.FC<CollapsibleAssistantProps> = ({
  content,
  onSuggestionApply
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Collapsible 
      open={!isCollapsed} 
      onOpenChange={(open) => setIsCollapsed(!open)}
      className="h-full"
    >
      <div className="flex flex-col h-full">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mb-4 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
          >
            {isCollapsed ? (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="sr-only">Expand Assistant</span>
              </>
            ) : (
              <>
                <ChevronRight className="w-4 h-4 mr-2" />
                Focus Mode
              </>
            )}
          </Button>
        </CollapsibleTrigger>

        {/* Collapsed state - show only icons */}
        {isCollapsed && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-3 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
              title="Writing Suggestions"
            >
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-3 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
              title="Generate Ideas"
            >
              <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-3 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
              title="Research Topic"
            >
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-3 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
              title="Tone Adjustment"
            >
              <Settings className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </Button>
            {content.length > 0 && (
              <Card className="glass shadow-medium">
                <CardContent className="p-3 text-center">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-xs space-y-1">
                    <div className="text-blue-700 dark:text-blue-300 font-medium">
                      {content.split(' ').filter(w => w.length > 0).length}
                    </div>
                    <div className="text-xs text-muted-foreground">words</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Expanded state - show full content */}
        <CollapsibleContent className="flex-1 space-y-4">
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CollapsibleAssistant;
